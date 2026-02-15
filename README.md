<p align="center">
  <img src="logo.png" alt="NodeWise Logo" width="200px">
</p>

# nodewise

> Node.js error explainer with AI-powered clarity

A production-ready CLI dev tool that intercepts and explains runtime errors in your Node.js applications. It works like nodemon but instead of just restarting on crash, it explains what went wrong in simple, natural language.

---

## 👨‍💻 Developer Information

**Gourab Das**
- **Email:** [dgourab574@gmail.com](mailto:dgourab574@gmail.com) | [gourab.sde@gmail.com](mailto:gourab.sde@gmail.com)
- **LinkedIn:** [linkedin.com/in/gourab2005](https://www.linkedin.com/in/gourab2005/)
- **GitHub:** [github.com/Gourab2005](https://github.com/Gourab2005)

---

## 🚀 How to Use

### Installation

Install `nodewise` as a development dependency in your project:

```bash
npm install -D nodewise
```

Or run it directly using `npx`:

```bash
npx nodewise your-app.js
```

### Usage

1. **First-time Experience**: The first time you run it, you'll be prompted to choose between **Gemini AI** and **Normal Detection** mode.
2. **Running Scripts**: Simply replace `node` or `nodemon` with `nodewise`:
   ```bash
   npx nodewise server.js
   ```
3. **Arguments**: Pass your app arguments as usual:
   ```bash
   npx nodewise server.js --port 3000
   ```

---

## 🤔 Why use nodewise?

Traditional error messages can be cryptic, long, or stacked with irrelevant internal module traces. **nodewise** solves this by:

- **Saving Time**: No more Googling stack traces. Get the fix instantly.
- **Smart Context**: Unlike manual searching, the AI mode understands your specific code structure.
- **Seamless Flow**: It combines the best of `nodemon` (auto-restart) with a built-in "senior developer" who explains your mistakes.

---

## ✨ Features

- 🤖 **Gemini Explainer**: Deep AI-powered analysis of crashes with code-specific solutions.
- 📊 **Normal Detection**: Pattern-based error detection for 50+ common Node.js errors (offline).
- 🔄 **Auto-Restart**: Watches `.js` and `.json` files and restarts instantly on save.
- 📝 **Minimalist Design**: High-end, gapped terminal output that doesn't clutter your workspace.
- ⚡ **Lightweight**: Zero heavy dependencies, keeping your dev environment fast.

---

## 📋 Example Output

  ✦ GEMINI INTELLIGENCE
  ─────────────────────────────────────────────

    Summary: This error occurs when you try to import or require a file that doesn't exist.

    Cause: Typo in the file name or path, or the file was moved/deleted.

    File: src/app.js:12

    Fix: 
    1. Check the spelling of the file path.
    2. Verify the file exists in that location.
    3. Use an absolute path if needed: `path.join(__dirname, './config')`

---

## CLI Commands

| Command | Description |
| :--- | :--- |
| `nodewise --setup` | Change modes or update AI configuration. |
| `nodewise --reset` | Reset all configurations. |
| `nodewise --help` | Show usage manual. |
| `nodewise -v` | Show current version. |

---

Made with ❤️ by [Gourab Das](https://github.com/Gourab2005)
