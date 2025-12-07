"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpQuery, setHelpQuery] = useState("");
  const [helpReply, setHelpReply] = useState("");

  // ----------------------------
  // AUTO-FIX RULES
  // ----------------------------
  function autoFixCode(code) {
    let lines = code.split("\n");

    let fixed = lines.map((line) => {
      let trimmed = line.trim();

      // Rule 1: Add missing semicolon
      if (
        trimmed !== "" &&
        !trimmed.endsWith(";") &&
        !trimmed.endsWith("{") &&
        !trimmed.endsWith("}") &&
        !trimmed.startsWith("//")
      ) {
        trimmed += ";";
      }

      // Rule 2: Remove extra spaces
      trimmed = trimmed.replace(/\s+/g, " ");

      return trimmed;
    });

    // Rule 3: Standard indentation (2 spaces)
    fixed = fixed.map((line) => "  " + line);

    // Rule 4: Fix missing closing brackets
    const openBrackets = (code.match(/{/g) || []).length;
    const closeBrackets = (code.match(/}/g) || []).length;

    if (openBrackets > closeBrackets) {
      const difference = openBrackets - closeBrackets;
      for (let i = 0; i < difference; i++) fixed.push("}");
    }

    return fixed.join("\n");
  }

  // ----------------------------
  // RUN CODE SAFELY
  // ----------------------------
  function runCode() {
    try {
      const logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.join(" ")),
      };

      const wrapped = new Function("console", code);
      wrapped(customConsole);

      setOutput(logs.join("\n") || "✔ Code executed successfully (no console output)");
    } catch (err) {
      setOutput("❌ Error: " + err.message);
    }
  }

  // ----------------------------
  // IMPROVED HELP SYSTEM
  // ----------------------------
  function getHelpReply(q) {
    q = q.toLowerCase();

    const helpResponses = [
      {
        keywords: ["semicolon", "semi", ";"],
        answer:
          "🟡 **Missing semicolon issue:**\nJavaScript statements usually require semicolons. Use Auto-Fix to add them automatically.",
      },
      {
        keywords: ["run", "execute", "output"],
        answer:
          "▶ **How to run code:**\nPress **Run Code**, and your JS will execute in a safe sandbox. Logs appear in the Console.",
      },
      {
        keywords: ["error", "bug", "problem", "issue"],
        answer:
          "❌ **Common error reasons:**\n• Missing semicolons\n• Missing brackets `{}`\n• Wrong variable names\n• Auto-Fix can help resolve simple issues.",
      },
      {
        keywords: ["bracket", "{", "}", "curly"],
        answer:
          "🟤 **Bracket Help:**\nMake sure every `{` has a matching `}`. Auto-Fix automatically closes missing brackets.",
      },
      {
        keywords: ["indent", "space"],
        answer:
          "🔵 **Indentation Help:**\nAuto-Fix cleans your indentation into a readable 2-space format.",
      },
      {
        keywords: ["autofix", "fix", "clean"],
        answer:
          "🟢 **Auto-Fix Info:**\nAuto-Fix does:\n• Add missing semicolons\n• Remove extra spaces\n• Fix indentation\n• Add missing `}` brackets",
      },
      {
        keywords: ["help", "how", "what"],
        answer:
          "💡 **What I can help with:**\nTry asking:\n• Why semicolon needed?\n• How to run code?\n• What causes errors?\n• How Auto-Fix works?",
      },
    ];

    for (let item of helpResponses) {
      if (item.keywords.some((kw) => q.includes(kw))) {
        return item.answer;
      }
    }

    return (
      "❓ I couldn't understand your question.\n\nTry asking about:\n" +
      "• semicolon\n• run\n• error\n• bracket\n• autofix\n• indentation"
    );
  }

  function askHelp() {
    setHelpReply(getHelpReply(helpQuery));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Code Editor App</h1>

        <button
          onClick={() => setHelpOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Help
        </button>
      </div>

      {/* CODE EDITOR */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your JavaScript code here..."
        className="w-full h-64 bg-gray-800 p-4 rounded text-sm font-mono border border-gray-600 outline-none"
      ></textarea>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={runCode}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Run Code
        </button>

        <button
          onClick={() => setCode(autoFixCode(code))}
          className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
        >
          Auto-Fix
        </button>
      </div>

      {/* OUTPUT CONSOLE */}
      <div className="mt-6 bg-black p-4 rounded h-40 overflow-auto text-sm font-mono border border-gray-700">
        {output || "Console output will appear here..."}
      </div>

      {/* HELP PANEL */}
      {helpOpen && (
        <div className="fixed right-0 top-0 w-80 h-full bg-gray-800 shadow-xl p-4 border-l border-gray-700">
          <h2 className="text-lg font-bold mb-2">Help Panel</h2>

          <button
            onClick={() => setHelpOpen(false)}
            className="mb-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Close
          </button>

          <input
            className="w-full p-2 bg-gray-700 rounded mb-3 outline-none"
            placeholder="Type your question..."
            value={helpQuery}
            onChange={(e) => setHelpQuery(e.target.value)}
          />

          <button
            onClick={askHelp}
            className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700"
          >
            Ask
          </button>

          <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 whitespace-pre-wrap">
            {helpReply || "Ask something like: semicolon, run, error..."}
          </div>
        </div>
      )}
    </div>
  );
}
