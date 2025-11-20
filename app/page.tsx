"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Sparkles, Play, Download, Upload, FileCode, Wand2 } from "lucide-react";

const INITIAL_CODE = `// Welcome to Vibe Code! 🚀
// AI-powered coding assistant

function greet(name) {
  return \`Hello, \${name}! Ready to code?\`;
}

console.log(greet("Developer"));
`;

export default function Home() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  async function handleAIEdit() {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setOutput("🤖 Processing your request...");

    try {
      // Simulate AI processing with intelligent code transformations
      await new Promise(resolve => setTimeout(resolve, 1500));

      let newCode = code;
      const lowerPrompt = prompt.toLowerCase();

      // Basic AI-like transformations
      if (lowerPrompt.includes("add comment") || lowerPrompt.includes("document")) {
        newCode = addComments(code);
      } else if (lowerPrompt.includes("remove comment")) {
        newCode = removeComments(code);
      } else if (lowerPrompt.includes("add error handling") || lowerPrompt.includes("try catch")) {
        newCode = addErrorHandling(code);
      } else if (lowerPrompt.includes("refactor") || lowerPrompt.includes("clean")) {
        newCode = refactorCode(code);
      } else if (lowerPrompt.includes("add logging") || lowerPrompt.includes("console")) {
        newCode = addLogging(code);
      } else if (lowerPrompt.includes("typescript") || lowerPrompt.includes("add types")) {
        newCode = convertToTypeScript(code);
        setLanguage("typescript");
      } else if (lowerPrompt.includes("async") || lowerPrompt.includes("promise")) {
        newCode = makeAsync(code);
      } else {
        newCode = `${code}\n\n// AI Response: ${prompt}\n// [Your code transformation would appear here]\n`;
      }

      setCode(newCode);
      setOutput("✅ Code updated successfully!");
      setPrompt("");
    } catch (error) {
      setOutput("❌ Error processing request");
    } finally {
      setIsProcessing(false);
    }
  }

  function addComments(code: string): string {
    const lines = code.split('\n');
    return lines.map(line => {
      if (line.trim().startsWith('function')) {
        return `  /**\n   * Function description\n   */\n${line}`;
      }
      if (line.trim().startsWith('const') || line.trim().startsWith('let')) {
        return `  // Variable declaration\n${line}`;
      }
      return line;
    }).join('\n');
  }

  function removeComments(code: string): string {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/^\s*[\r\n]/gm, '');
  }

  function addErrorHandling(code: string): string {
    return `try {\n${code.split('\n').map(l => '  ' + l).join('\n')}\n} catch (error) {\n  console.error('Error:', error);\n  throw error;\n}`;
  }

  function refactorCode(code: string): string {
    return code
      .replace(/var /g, 'const ')
      .split('\n')
      .filter(line => line.trim())
      .join('\n');
  }

  function addLogging(code: string): string {
    return code.replace(
      /function\s+(\w+)/g,
      'function $1(...args) {\n  console.log("Calling $1 with:", args);'
    );
  }

  function convertToTypeScript(code: string): string {
    return code
      .replace(/function\s+(\w+)\s*\(/g, 'function $1(')
      .replace(/\((\w+)\)/g, '($1: string)')
      .replace(/\)/g, '): string');
  }

  function makeAsync(code: string): string {
    return code
      .replace(/function\s+/g, 'async function ')
      .replace(/return\s+/g, 'return await ');
  }

  function runCode() {
    setOutput("Running code...\n");
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
      };

      eval(code);

      console.log = originalLog;
      setOutput(logs.join('\n') || "Code executed successfully (no output)");
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  }

  function downloadCode() {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'typescript' ? 'ts' : 'js'}`;
    a.click();
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#111] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Vibe Code
              </h1>
              <p className="text-xs text-gray-400">AI-Powered Code Editor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          {/* Toolbar */}
          <div className="bg-[#111] border-b border-gray-800 px-4 py-2 flex items-center gap-2">
            <button
              onClick={runCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".js,.ts,.jsx,.tsx,.py,.html,.css"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <div className="flex-1" />
            <FileCode className="w-4 h-4 text-gray-500" />
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="w-96 flex flex-col bg-[#0d0d0d]">
          {/* AI Chat Header */}
          <div className="bg-[#111] border-b border-gray-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
          </div>

          {/* Output */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap min-h-[200px]">
              {output || "Output will appear here..."}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400 font-semibold mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Add comments",
                  "Add error handling",
                  "Refactor code",
                  "Add logging",
                  "Convert to TypeScript",
                  "Make async",
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setPrompt(action);
                      setTimeout(() => {
                        setPrompt(action);
                        handleAIEdit();
                      }, 0);
                    }}
                    disabled={isProcessing}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-left transition disabled:opacity-50"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIEdit()}
                placeholder="Ask AI to modify your code..."
                disabled={isProcessing}
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
              <button
                onClick={handleAIEdit}
                disabled={isProcessing || !prompt.trim()}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "add comments", "add error handling", "refactor"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
