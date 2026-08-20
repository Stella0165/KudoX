import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export type RecipeStep = {
    title: string;
    content: string;
    timerSeconds: number | null;
};

export type RecipeIngredient = {
    name: string;
    amount: number;
    unit: string | null;
    haveIt: boolean;
};

export type RecipeResult = {
    title: string;
    description: string;
    cuisine: string | null;
    baseServings: number;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
};

type CookRequestBody = { mode: "cook"; ingredients: string; timeMinutes: number; dietary: string[] };
type EatRequestBody  = { mode: "eat";  cuisine: string;     timeMinutes: number; dietary: string[] };
type SurpriseRequestBody = { mode: "surprise"; timeMinutes: number; dietary: string[] };
type RequestBody = CookRequestBody | EatRequestBody | SurpriseRequestBody;

function buildPrompt(body: RequestBody): string {
    const dietary = body.dietary?.length ? `Dietary restrictions: ${body.dietary.join(", ")}.` : "";
    const time    = `Must be realistically cookable within ${body.timeMinutes} minutes.`;

    const groundingRules = `
Rules:
- The recipe must be a real, recognized dish from an actual culinary tradition — not an invented fusion or novelty combination.
- Flavor pairings must be ones a professional chef would consider sensible and appetizing, not shocking or gimmicky.
- Do not combine sweet fruit with savory/spicy elements unless it's a well-established dish (e.g. mango salsa, pineapple fried rice are fine — invented combos are not).
- Prefer well-known, comforting, or classic recipes over obscure or experimental ones.
`.trim();

    if (body.mode === "cook") {
        return `Suggest ONE recipe using these ingredients: ${body.ingredients}. ${time} ${dietary}
${groundingRules}
Mark haveIt true for ingredients the user has, false for ones they need to buy.
Use short step descriptions. timerSeconds only for waiting/boiling/baking steps, else null.`;
    }

    if (body.mode === "eat") {
        return `Suggest ONE well-known, authentic ${body.cuisine} recipe that a restaurant in that cuisine would actually serve. ${time} ${dietary}
${groundingRules}
All ingredients haveIt: false. Use short step descriptions. timerSeconds only for waiting steps, else null.`;
    }

    return `Suggest ONE recipe that is well-known within its cuisine but perhaps less common on Western menus — a comforting, authentic dish, not an invented one. ${time} ${dietary}
${groundingRules}
All ingredients haveIt: false. Use short step descriptions. timerSeconds only for waiting steps, else null.
Favor dishes that are popular in their home country/culture, even if unfamiliar to the user — not dishes that are unusual within their own tradition.`;
}

const RECIPE_SCHEMA = {
    type: "object",
    properties: {
        title:       { type: "string" },
        description: { type: "string" },
        cuisine:     { type: "string", nullable: true },
        baseServings: { type: "number" },
        ingredients: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name:   { type: "string" },
                    amount: { type: "number" },
                    unit:   { type: "string", nullable: true },
                    haveIt: { type: "boolean" },
                },
                required: ["name", "amount", "unit", "haveIt"],
            },
        },
        steps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title:        { type: "string" },
                    content:      { type: "string" },
                    timerSeconds: { type: "integer", nullable: true },
                },
                required: ["title", "content", "timerSeconds"],
            },
        },
    },
    required: ["title", "description", "cuisine", "baseServings", "ingredients", "steps"],
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RequestBody;

        if (!body.mode || !["cook", "eat", "surprise"].includes(body.mode)) {
            return NextResponse.json({ error: "Invalid mode." }, { status: 400 });
        }
        if (body.mode === "cook" && !body.ingredients?.trim()) {
            return NextResponse.json({ error: "Please list at least one ingredient." }, { status: 400 });
        }
        if (body.mode === "eat" && !body.cuisine?.trim()) {
            return NextResponse.json({ error: "Please choose a cuisine." }, { status: 400 });
        }
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
        }

        let result;
        try {
            result = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: [{ role: "user", parts: [{ text: buildPrompt(body) }] }],
                config: {
                    maxOutputTokens: 1500,
                    responseMimeType: "application/json",
                    responseSchema: RECIPE_SCHEMA,
                },
            });
        } catch (err) {
            console.error("Gemini error:", err);
            return NextResponse.json(
                { error: "AI request failed. Please try again." },
                { status: 500 }
            );
        }

        const rawText = result?.text || "";
        let recipe: RecipeResult;
        try {
            recipe = JSON.parse(rawText);
        } catch {
            console.error("JSON parse failed:", rawText);
            return NextResponse.json({ error: "Invalid response from AI. Please try again." }, { status: 500 });
        }

        if (!recipe.steps || !recipe.ingredients) {
            return NextResponse.json({ error: "Incomplete recipe. Please try again." }, { status: 500 });
        }

        return NextResponse.json(recipe, { status: 200 });

    } catch (err) {
        console.error("Unhandled error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}