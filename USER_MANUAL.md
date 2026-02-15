# 📖 NodeWise User Manual

Welcome to **NodeWise**, your AI-powered companion for Node.js development. This manual will help you get the most out of NodeWise's error explanation and auto-restart features.

---

## 🚀 Getting Started

NodeWise is designed to be a drop-in replacement for `node` or `nodemon` during development.

### Installation
If you haven't already, you can link it globally or install it in your project:
```bash
# Link for local development
npm link

# Install as a dev dependency
npm install -D nodewise
```

### Initial Setup
The first time you run NodeWise, it will launch a setup wizard to configure your preferred explanation mode.
```bash
npx nodewise --setup
```

---

## 🤖 Explanation Modes

### 1. Gemini Explainer (AI-Powered)
The "Top-G" mode. It uses Google's latest Gemini models to analyze your specific code and provide context-aware fixes.

*   **Setup**: Requires a free Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   **Best for**: Complex logic errors, obscure Node.js core errors, and step-by-step fix guides.
*   **Features**: Beautiful minimalist terminal output with neon highlighting.

### 2. Normal Detection (Offline)
A lightning-fast, pattern-based mode that works entirely offline.

*   **Setup**: No setup required.
*   **Best for**: Common errors like `MODULE_NOT_FOUND`, `TypeError`, and `ReferenceError`.
*   **Features**: Zero latency, works without an internet connection.

---

## ⌨️ Command Line Interface

| Command | Description |
| :--- | :--- |
| `nodewise <script.js>` | Run a script with auto-restart and error explainer. |
| `nodewise --setup` | Change modes or update your Gemini API key. |
| `nodewise --reset` | Wipe configuration and start fresh. |
| `nodewise --help` | Show available options and examples. |
| `nodewise -v` | Check your current NodeWise version. |

### Running with Arguments
You can pass arguments to your script just like you would with node:
```bash
nodewise server.js --port 3000 --env production
```

---

## ⚙️ Configuration
NodeWise saves your preferences in `nodewise.config.json` in your project root.

```json
{
  "mode": "gemini",
  "gemini": {
    "apiKey": "YOUR_KEY_HERE"
  },
  "autoRestart": true,
  "ignorePatterns": ["node_modules", ".git"],
  "timeout": 60000
}
```

*   **autoRestart**: Set to `false` if you don't want the process to restart on file changes.
*   **timeout**: Increase this if the AI is taking too long to respond on slow connections.

---

## ✨ Pro Tips

### 1. Minimalist AI Insight
When a crash occurs in Gemini mode, you'll see a clean, gapped output. We've removed bulky boxes to keep your terminal clean. Look for the **✦ GEMINI INTELLIGENCE** header.

### 2. Auto-Restart
NodeWise watches your `.js` and `.json` files. As soon as you save a fix, NodeWise will instantly restart your application, allowing for a rapid "Code-Crash-Fix-Repeat" cycle.

### 3. Graceful Exit
Use `Ctrl+C` to shut down both your application and the NodeWise watcher gracefully.

---

## 🆘 Troubleshooting

*   **API Timeouts**: If you see "Gemini timed out," check your internet connection or increase the `timeout` in `nodewise.config.json`.
*   **Invalid Key**: Ensure your API key is correct by re-running `nodewise --setup`.
*   **Files not watching**: Ensure the directory you are working in doesn't have an ignore pattern matching your files.

---

*Made with ❤️ for Node.js developers.*
