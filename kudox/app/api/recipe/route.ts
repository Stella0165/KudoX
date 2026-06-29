import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

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
    shoppingList: string[];
    notes: string | null;
};

type CookRequestBody = {
    mode: "cook";
    ingredients: string;
    timeMinutes: number;
    dietary: string[];
};

type EatRequestBody = {
    mode: "eat";
    cuisine: string;
    timeMinutes: number;
    dietary: string[];
};

type SurpriseRequestBody = {
    mode: "surprise";
    timeMinutes: number;
    dietary: string[];
};


type RequestBody = CookRequestBody | EatRequestBody | SurpriseRequestBody;

function buildPrompt(body: RequestBody): string {
    const dietaryLine =
        body.dietary && body.dietary.length > 0
            ? `Dietary restrictions to strictly respect: ${body.dietary.join(", ")}.`
            : "No dietary restrictions specified.";

    const timeLine = `The user has about ${body.timeMinutes} minutes to cook.`;

    if (body.mode === "cook") {
        return `You are a helpful home cooking assistant for an app called KudoX.
The user will tell you what ingredients they already have at home. Suggest ONE recipe they can make using mostly those ingredients (a few common pantry staples like salt, oil, water are fine to assume).

Ingredients the user has: ${body.ingredients}
${timeLine}
${dietaryLine}

Rules:
- "ingredients" should list ALL ingredients needed for the recipe, each marked haveIt true if it came from the user's list, false if it's something they need to buy.
- "shoppingList" should be a simple flat list derived from the ingredients marked haveIt: false.
- Keep the recipe realistically doable within the given time.
- Use metric or common units (g, kg, ml, l, tsp, tbsp, cup, pinch) or omit unit for whole items like "2 eggs" (put count in the name if needed, e.g. name: "eggs", amount: 2, unit: null).
- timerSeconds should be set for any step involving waiting, boiling, baking, simmering, resting, etc. Use null for purely active steps.`;
    }

    if (body.mode === "eat") {
        return `You are a helpful food discovery assistant for an app called KudoX.
The user wants inspiration for what to eat, based on a cuisine they're craving. Suggest ONE dish in that cuisine style. Assume the user has nothing on hand — list the full ingredient list as their shopping list.

Cuisine craved: ${body.cuisine}
${timeLine}
${dietaryLine}

Rules:
- Since the user has nothing on hand, ALL ingredients should have haveIt: false, and shoppingList should include all of them.
- Keep the recipe realistically doable within the given time. If a traditional version takes longer, suggest a faster adaptation and mention that in "notes".
- Use metric or common units (g, kg, ml, l, tsp, tbsp, cup, pinch) or omit unit for whole items.
- timerSeconds should be set for any step involving waiting, boiling, baking, simmering, resting, etc. Use null for purely active steps.`;
    }

    // mode === "surprise"
    return `You are a playful, adventurous food discovery assistant for an app called KudoX.
The user tapped "Surprise Me" — they want a fun, unexpected dish suggestion with NO input on cuisine or ingredients. Pick a genuinely interesting dish: it could be from any cuisine in the world, comforting or adventurous, classic or a fun twist. Make it feel like a delightful surprise, not a generic safe choice. Assume the user has nothing on hand.

${timeLine}
${dietaryLine}

Rules:
- Keep the recipe realistically doable within the given time. If a traditional version takes longer, suggest a faster adaptation".
- Use metric or common units (g, kg, ml, l, tsp, tbsp, cup, pinch) or omit unit for whole items.
- timerSeconds should be set for any step involving waiting, boiling, baking, simmering, resting, etc. Use null for purely active steps.
- Vary your suggestion, avoid defaulting to the most obvious or common dish every time.`;
}

const RECIPE_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        title: { type: "string" },
        description: { type: "string" },
        cuisine: { type: "string", nullable: true },
        baseServings: { type: "number" },
        ingredients: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    amount: { type: "number" },
                    unit: { type: "string", nullable: true },
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
                    title: { type: "string" },
                    content: { type: "string" },
                    timerSeconds: { type: "integer", nullable: true },
                },
                required: ["title", "content", "timerSeconds"],
            },
        },
        shoppingList: { type: "array", items: { type: "string" } },
        notes: { type: "string", nullable: true },
    },
    required: ["title", "description", "cuisine", "baseServings", "ingredients", "steps", "shoppingList", "notes"],
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RequestBody;

        if (!body.mode || (body.mode !== "cook" && body.mode !== "eat" && body.mode !== "surprise")) {
            return NextResponse.json(
                { error: "Invalid request: mode must be 'cook', 'eat', or 'surprise'." },
                { status: 400 }
            );
        }

        if (body.mode === "cook" && (!body.ingredients || !body.ingredients.trim())) {
            return NextResponse.json(
                { error: "Please list at least one ingredient you have." },
                { status: 400 }
            );
        }

        if (body.mode === "eat" && (!body.cuisine || !body.cuisine.trim())) {
            return NextResponse.json(
                { error: "Please choose a cuisine you're craving." },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server is missing GEMINI_API_KEY." },
                { status: 500 }
            );
        }

        const prompt = buildPrompt(body);

        let result;

        try {
            console.log("🔥 STEP 1: calling Gemini");

            result = await ai.models.generateContent({
                model: "gemini-3.5-flash",

                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],

                config: {
                    temperature: 0.3,
                    maxOutputTokens: 2000,
                    responseMimeType: "application/json",
                },
            });

            console.log("🔥 STEP 2: got result");
            console.log("🔥 FULL RESULT:", result);

        } catch (err) {
            console.error("❌ STEP FAILED (Gemini call):", err);

            return NextResponse.json(
                {
                    error: "Gemini failed at API call",
                    detail: err instanceof Error ? err.message : String(err),
                },
                { status: 500 }
            );
        }

        const rawText = result?.text || "";

        console.log("🔥 STEP 3 rawText:", rawText);

        let recipe: RecipeResult;

        try {
            recipe = JSON.parse(rawText);
            console.log("🔥 STEP 4 parsed OK");
        } catch (err) {
            console.error("❌ JSON PARSE FAILED:", rawText);

            return NextResponse.json(
                {
                    error: "Invalid JSON from AI",
                    raw: rawText,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(recipe, { status: 200 });
    } catch (err) {
        console.error("Unhandled error in /api/recipe:", err);
        return NextResponse.json(
            { error: "Something went wrong on our end. Please try again." },
            { status: 500 }
        );
    }
}