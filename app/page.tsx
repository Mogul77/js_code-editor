"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [helpQuery, setHelpQuery] = useState<string>("");
  const [helpReply, setHelpReply] = useState<string>("");

  // ----------------------------
  // AUTO-FIX RULES
  // ----------------------------
  function autoFixCode(code: string): string {
    let lines: string[] = code.split("\n");

    let fixed = lines.map((line: string) => {
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
    fixed = fixed.map((line: string) => "  " + line);

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
      const logs: string[] = [];
      const customConsole = {
        log: (...args: unknown[]) => logs.push(args.join(" ")),
      };

      const wrapped = new Function("console", code);
      wrapped(customConsole);

      setOutput(
        logs.join("\n") ||
          "✔ Code executed successfully (no console output)"
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOutput("❌ Error: " + err.message);
      } else {
        setOutput("❌ Unknown Error");
      }
    }
  }

  // ----------------------------
  // HELP SYSTEM
  // ----------------------------
  function getHelpReply(q: string): string {
    q = q.toLowerCase();

    const helpResponses = [
      {
        keywords: ["semicolon", "semi", ";"],
        answer:
          "🟡 Missing semicolon: JavaScript usually requires semicolons. Auto-Fix adds them.",
      },
      {
        keywords: ["run", "execute", "output"],
        answer:
          "▶ To run the code, press Run Code. Output appears below.",
      },
      {
        keywords: ["error", "bug", "issue", "problem"],
        answer:
          "❌ Common errors: missing semicolons, missing brackets, wrong names. Auto-Fix can help.",
      },
      {
        keywords: ["bracket", "{", "}", "curly"],
        answer:
          "🟤 Bracket help: every { needs a matching }. Auto-Fix closes missing brackets.",
      },
      {
        keywords: ["indent", "space"],
        answer:
          "🔵 Auto-Fix formats indentation to clean 2-space indentation.",
      },
      {
        keywords: ["autofix", "fix", "clean"],
        answer:
          "🟢 Auto-Fix does: add semicolons, remove extra spaces, indentation, close brackets.",
      },
      {
        keywords: ["help", "how", "what"],
        answer:
          "💡 You can ask about semicolons, running code, errors, or auto-fix rules.",
      },
    ];

    for (let item of helpResponses) {
      if (item.keywords.some((kw) => q.includes(kw))) {
        return item.answer;
      }
    }

    return "❓ Sorry, I couldn't understand your question.";
  }

  function askHelp() {
    setHelpReply(getHelpReply(helpQuery));
  }

  // UI -------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Code Editor App</h1>
        <button
          onClick={() => setHelpOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Help
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your JavaScript code here..."
        className="w-full h-64 bg-gray-800 p-4 rounded text-sm font-mono border border-gray-600 outline-none"
      ></textarea>

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

      <div className="mt-6 bg-black p-4 rounded h-40 overflow-auto text-sm font-mono border border-gray-700">
        {output || "Console output will appear here..."}
      </div>

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
