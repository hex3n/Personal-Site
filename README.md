# This is my Portfolio Site

> ⚠️ This project is currently in active development.

## 🚀 Features

- 🖥️ Terminal-style UI built with **Tailwind CSS**
- ⚡ Fast static site powered by **Bun**
- 🔍 Command autocompletion using a prefix trie
- ⌨️ Shell-like commands:
  - `help` — Show available commands
  - `cd` — Navigate to sections/pages
  - `ls` — List pages
  - `echo` — Echo back input
  - `clear` — Clear the terminal
  - `whoami`, `pwd`, `slowking` — fun easter egg commands
- ⏳ Command history using arrow keys
- 🧠 Static site deployed via **GitHub Pages**

## 📁 Project Structure

```
├── public/
│   ├── assets/         # Static assets: CSS, JS, fonts
│   ├── index.html      # Main entry HTML
│   └── *.html          # Additional pages (about, services, etc.)
├── src/
│   ├── ts/             # TypeScript source
│   ├── css/            # Tailwind input CSS
├── scripts/            # Utility scripts (e.g. build/compress)
├── tsconfig.json       # TypeScript config
├── bun.lock            # Bun lockfile
```

## 🛠️ Getting Started

Make sure you have **[Bun](https://bun.sh)** installed.

```bash
bun install
bun run build
bun run start  # or serve /public however you prefer
```

## 🧪 Linting & Security

We use `lefthook` and `bun lint` to enforce formatting, linting, and auditing:

```bash
bun lint
```

## 🐙 GitHub Pages Deployment

Build and push to `gh-pages` branch:

```bash
bun run build
# GitHub Actions deploys from /public to GitHub Pages
```

## 📜 License

MIT © 2025 — built with ☕ by [Slowbro213](https://github.com/Slowbro213)
