import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { RecipeResult } from "../recipe/route";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

type EatRequestBody = {
    cuisine: string;       // e.g. "Japanese", "Korean"
    allergies: string[];   // e.g. ["nuts", "shellfish"]
};

const RECIPE_SCHEMA = {
    type: "object",
    properties: {
        title: { type: "string" },
        description: { type: "string" },
        cuisine: { type: "string" },
        baseServings: { type: "number" },
        ingredients: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    amount: { type: "number" },
                    unit: { type: "string" },
                    haveIt: { type: "boolean" },
                },
                required: ["name", "amount", "unit", "haveIt"],
                additionalProperties: false,
            },
        },
        steps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    timerSeconds: { type: "number" },
                },
                required: ["title", "content", "timerSeconds"],
                additionalProperties: false,
            },
        },
    },
    required: ["title", "description", "cuisine", "baseServings", "ingredients", "steps"],
    additionalProperties: false,
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as EatRequestBody;

        if (!body.cuisine?.trim()) {
            return NextResponse.json({ error: "Please choose a cuisine." }, { status: 400 });
        }
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
        }

        const allergyLine = body.allergies?.length
            ? `Strictly avoid these allergens: ${body.allergies.join(", ")}.`
            : "";

        const prompt = `Suggest ONE ${body.cuisine} dish recipe. ${allergyLine}
All ingredients haveIt: false. Use short, clear step descriptions. timerSeconds is required for every step — use 0 for steps with no waiting/cooking time, otherwise the number of seconds.
Use real units like g, ml, tbsp, tsp, or "piece" for whole items.`;

        let completion;
        try {
            completion = await groq.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "recipe",
                        strict: true,
                        schema: RECIPE_SCHEMA,
                    },
                },
                max_completion_tokens: 1500,
                temperature: 0.4,
            });
        } catch (err) {
            console.error("Groq error:", err);
            return NextResponse.json({ error: "AI request failed. Please try again." }, { status: 500 });
        }

        const rawText = completion.choices[0]?.message?.content || "";

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