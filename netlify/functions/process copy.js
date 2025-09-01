// netlify/functions/process.js

export async function handler(event) {
  try {
    const { inputText, mode, option } = JSON.parse(event.body);

    if (!inputText || inputText.trim().length < 20) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Input text too short" }),
      };
    }

    // Word limits for summarization
    const summaryLengths = {
      Short: 80,
      Medium: 200,
      Long: 400,
    };

    // Build prompt
    let prompt = "";
    if (mode === "Summarize") {
      const targetWords = summaryLengths[option] || 150;
      prompt = `Summarize the following text in about ${targetWords} words. 
      Use clear language and make it easy to understand. 
      Always finish with a proper conclusion. 
      Text: """${inputText}"""`;
    } else if (mode === "Rewrite") {
      prompt = `Rewrite the following text in a ${option} tone. 
      Preserve the meaning, but adapt the style. 
      Ensure the rewritten version feels complete and polished.
      Text: """${inputText}"""`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid mode" }),
      };
    }

    // Helper: Call OpenAI API
    async function callOpenAI(userPrompt, maxTokens) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: userPrompt }],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error("OpenAI API request failed");
      }

      return response.json(); // ✅ return JSON, no `data` inside here
    }

    // Estimate tokens (approx: 1 word = 1.5 tokens)
    const maxTokens =
      mode === "Summarize" ? summaryLengths[option] * 2 : 400;

    // First API call
    let data = await callOpenAI(prompt, maxTokens);
    let result = data.choices?.[0]?.message?.content?.trim() || "";

    // Fallback if incomplete
    const endsAbruptly =
      !/[.!?]"?$/.test(result) || result.endsWith("...");
    if (endsAbruptly) {
      console.warn("Fallback triggered: response seems incomplete.");

      const fallbackPrompt = `The previous ${mode.toLowerCase()} seems incomplete. 
      Continue and finish it with a strong conclusion. Do not repeat text.
      Incomplete text: """${result}"""`;

      data = await callOpenAI(fallbackPrompt, 200);
      const continuation = data.choices?.[0]?.message?.content?.trim() || "";
      result = result + "\n\n" + continuation;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("Error in process function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}
