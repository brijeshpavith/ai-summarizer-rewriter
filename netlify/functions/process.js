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
    const summaryLengths = { Short: 80, Medium: 200, Long: 400 };

    // Word ceiling for rewrite
    const rewriteMaxWords = 300;

    // Build prompt
    let prompt = "";
    if (mode === "Summarize") {
      const targetWords = summaryLengths[option] || 150;
      prompt = `Summarize the following text in about ${targetWords} words. 
      Use clear language, keep the key points, and finish with a conclusion.
      Text: """${inputText}"""`;
    } else if (mode === "Rewrite") {
      prompt = `Rewrite the following text in a ${option} tone. 
      Preserve the meaning, adapt the style, and ensure completeness.
      IMPORTANT RULES:
      - Do NOT repeat the original input text.
      - Only output the rewritten passage.
      - Maximum length: ${rewriteMaxWords} words.
      Text to rewrite:
      """${inputText}"""`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid mode" }),
      };
    }

    // Check API key presence
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing OpenAI API key. Please configure OPENAI_API_KEY.",
        }),
      };
    }

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: mode === "Summarize" ? summaryLengths[option] * 2 : 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `OpenAI error: ${data.error.message || "Unknown error"}`,
        }),
      };
    }

    let result = data.choices?.[0]?.message?.content?.trim() || "";

    // Safeguard: If the model repeats input, strip it
    if (mode === "Rewrite" && result.includes(inputText.slice(0, 80))) {
      console.warn("Model repeated input, cleaning up...");
      result = result.replace(inputText, "").trim();
    }

    // Enforce word ceiling for Rewrite
    if (mode === "Rewrite") {
      const words = result.split(/\s+/);
      if (words.length > rewriteMaxWords) {
        result = words.slice(0, rewriteMaxWords).join(" ") + " ...";
      }
    }

    if (!result) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No content generated" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error occurred" }),
    };
  }
}
