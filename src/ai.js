const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    const API_KEY = import.meta.env.VITE_OPENROUTER_KEY

    if (!API_KEY) {
        console.error("❌ No OpenRouter API key found in environment variables.")
        return "API key missing. Please set VITE_OPENROUTER_KEY in your .env file."
    }

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mixtral-8x7b-instruct",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `I have ${ingredientsString}. Give me a recipe I can make with these.` },
                ],
                max_tokens: 1024
            })
        })

        const data = await res.json()
        if (!data.choices || !data.choices.length) {
            return "No recipe found, sorry!"
        }
        return data.choices[0].message.content
    } catch (err) {
        console.error("API ERROR:", err)
        return "Something went wrong. Please try again later."
    }
}