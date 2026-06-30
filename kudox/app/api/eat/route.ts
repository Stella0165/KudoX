import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

type EatRequestBody = {
    cuisine: string;
    allergies: string[];
};

export type DishResult = {
    name: string;
    localName?: string;
    cuisine: string;
    priceRange: string;
    description: string;
    whereToFind: string;
    allergenNote?: string;
};

const DISH_SCHEMA = {
    type: "object",
    properties: {
        name: { type: "string" },
        localName: { type: "string" },
        cuisine: { type: "string" },
        priceRange: { type: "string" },
        description: { type: "string" },
        whereToFind: { type: "string" },
        allergenNote: { type: "string" },
    },
    required: ["name", "localName", "cuisine", "priceRange", "description", "whereToFind", "allergenNote"],
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
            ? `Strictly avoid dishes containing these allergens: ${body.allergies.join(", ")}.`
            : "";

        const prompt = `Suggest ONE specific ${body.cuisine} dish that someone could order at a restaurant or find to buy (not cook themselves), in Malaysia. ${allergyLine}

Return:
- name: the dish's common English name
- localName: the dish's name in its native language/script, if different from the English name (empty string if same)
- cuisine: "${body.cuisine}"
- priceRange: a realistic price range in Malaysian Ringgit for this dish at a typical restaurant or stall in Malaysia, formatted exactly like "RM 8 - RM 15"
- description: 1-2 sentences describing what the dish is and tastes like
- whereToFind: practical advice on where to find or order this dish (e.g. type of restaurant, delivery apps, or where it's commonly sold)
- allergenNote: if any common allergens are typically present, mention them here as a heads up; otherwise empty string`;

        let completion;
        try {
            completion = await groq.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "dish",
                        strict: true,
                        schema: DISH_SCHEMA,
                    },
                },
                max_completion_tokens: 600,
                temperature: 0.6,
            });
        } catch (err) {
            console.error("Groq error:", err);
            return NextResponse.json({ error: "AI request failed. Please try again." }, { status: 500 });
        }

        const rawText = completion.choices[0]?.message?.content || "";

        let dish: DishResult;
        try {
            dish = JSON.parse(rawText);
        } catch {
            console.error("JSON parse failed:", rawText);
            return NextResponse.json({ error: "Invalid response from AI. Please try again." }, { status: 500 });
        }

        if (!dish.name || !dish.description) {
            return NextResponse.json({ error: "Incomplete suggestion. Please try again." }, { status: 500 });
        }

        return NextResponse.json(dish, { status: 200 });

    } catch (err) {
        console.error("Unhandled error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}