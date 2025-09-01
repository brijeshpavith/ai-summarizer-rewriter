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

      if (response.ok && data.result) {
        setOutput(data.result);
      } else if (data.error) {
        setOutput(`⚠️ ${data.error}`);
      } else {
        setOutput("⚠️ Unexpected error occurred. Try again later.");
      }
    } catch (err) {
      console.error(err);
      setOutput("⚠️ Network error: Could not reach server.");
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white text-center py-6 text-2xl font-extrabold shadow-md">
        ✨ AI Summarizer & Rewriter
      </header>

      {/* Main Split Layout */}
      <main className="flex flex-1 flex-col lg:flex-row p-8 gap-8">
        {/* Left Panel: Input */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl p-6 flex flex-col border border-purple-100">
          <h2 className="text-lg font-semibold mb-4 text-purple-700">Paste Text</h2>
          <textarea
            className="flex-1 border rounded-lg p-3 mb-4 resize-none focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-700"
            placeholder="Paste your article, report, or passage here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {/* Mode Selector */}
          <label className="block mb-2 font-medium text-gray-700">Mode:</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setOption(e.target.value === "Summarize" ? "Short" : "Casual");
            }}
            className="w-full border rounded-lg p-2 mb-4 bg-gray-50 focus:ring-2 focus:ring-purple-400"
          >
            <option>Summarize</option>
            <option>Rewrite</option>
          </select>

          {/* Options based on mode */}
          <label className="block mb-2 font-medium text-gray-700">
            {mode === "Summarize" ? "Summary Length:" : "Rewrite Style:"}
          </label>
          <select
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="w-full border rounded-lg p-2 mb-6 bg-gray-50 focus:ring-2 focus:ring-purple-400"
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
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg font-medium shadow hover:scale-105 hover:opacity-90 transition-transform"
          >
            {loading ? "Processing..." : "Process Text"}
          </button>
        </div>

        {/* Right Panel: Output */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl p-6 flex flex-col border border-purple-100">
          <h2 className="text-lg font-semibold mb-4 text-purple-700">Output</h2>

          {loading && (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic">
              Processing...
            </div>
          )}

          {!loading && output && (
            <>
              {/* Badge */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                  {mode} – {option}
                </span>
              </div>

              <p className="flex-1 whitespace-pre-wrap border rounded-lg p-3 bg-gray-50 text-gray-800 leading-relaxed">
                {output}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleCopy}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Download .txt
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-600 border-t bg-white/50">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-purple-600">HumAIne</span> – Brijesh P.
      </footer>
    </div>
  );
}

export default App;
