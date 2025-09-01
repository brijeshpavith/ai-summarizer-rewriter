import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("Summarize");
  const [option, setOption] = useState("Short");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim()) {
      alert("Please paste some text to process.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const response = await fetch("/.netlify/functions/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, mode, option }),
      });

      const data = await response.json();
      setOutput(data.result || "Error: No output generated.");
    } catch (err) {
      console.error(err);
      setOutput("Error: Could not process text.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-output-${mode.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Make sure this return is inside the function
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-purple-600 text-white text-center py-4 text-xl font-bold">
        AI Summarizer & Rewriter
      </header>

      {/* Main Split Layout */}
      <main className="flex flex-1 p-6 gap-6">
        {/* Left Panel: Input */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Paste Text</h2>
          <textarea
            className="flex-1 border rounded-lg p-2 mb-4 resize-none"
            placeholder="Paste your article, report, or passage here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {/* Mode Selector */}
          <label className="block mb-2 font-medium">Mode:</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setOption(e.target.value === "Summarize" ? "Short" : "Casual");
            }}
            className="w-full border rounded-lg p-2 mb-4"
          >
            <option>Summarize</option>
            <option>Rewrite</option>
          </select>

          {/* Options based on mode */}
          <label className="block mb-2 font-medium">
            {mode === "Summarize" ? "Summary Length:" : "Rewrite Style:"}
          </label>
          <select
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
          >
            {mode === "Summarize" ? (
              <>
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </>
            ) : (
              <>
                <option>Casual</option>
                <option>Professional</option>
                <option>Simplified</option>
              </>
            )}
          </select>

          <button
            onClick={handleProcess}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Processing..." : "Process Text"}
          </button>
        </div>

        {/* Right Panel: Output */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Output</h2>

          {loading && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Processing...
            </div>
          )}

          {!loading && output && (
            <>
              <p className="flex-1 whitespace-pre-wrap border rounded-lg p-2 bg-gray-50">
                {output}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-gray-700 text-white px-3 py-1 rounded-lg"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  Download .txt
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-gray-600 border-t">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-purple-600">HumAIne</span> – Brijesh P.
      </footer>
    </div>
  );
}

// ✅ Ensure this export is at the bottom
export default App;
