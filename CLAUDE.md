# CLAUDE.md — rss-reader

> **Documentation Version**: 1.0
> **Last Updated**: 2026-05-04
> **Project**: rss-reader
> **Description**: A Feedly-like RSS feed reader web app
> **Stack**: TypeScript · React · Node.js · SQLite

## 🚨 CRITICAL RULES - READ FIRST

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use `src/main/typescript/`
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, Grep, Glob tools
- **NEVER** create duplicate files (manager_v2.ts, enhanced_xyz.ts) → extend existing files
- **NEVER** use naming like `enhanced_`, `improved_`, `new_`, `v2_` → extend originals
- **NEVER** use git commands with `-i` flag

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase
- **GITHUB BACKUP** — push after every commit: `git push origin main`
- **READ FILES FIRST** before editing
- **SEARCH FIRST** — Grep/Glob before creating new files

## 🏗️ PROJECT STRUCTURE

```
rss-reader/
├── src/
│   ├── main/
│   │   ├── typescript/
│   │   │   ├── core/        # RSS parsing, feed management
│   │   │   ├── utils/       # Shared utilities
│   │   │   ├── models/      # Feed, Article, User types
│   │   │   ├── services/    # FeedService, ArticleService
│   │   │   └── api/         # REST API routes
│   │   └── resources/
│   │       ├── config/      # App config
│   │       └── assets/      # Static assets
│   └── test/
│       ├── unit/
│       └── integration/
├── docs/
├── tools/
└── output/
```

## 🚀 COMMON COMMANDS

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
git push origin main # Push to GitHub
```

## 🎯 RULE COMPLIANCE CHECK

Before starting ANY task:
- [ ] I acknowledge all critical rules above
- [ ] Files go in `src/main/typescript/` (not root)
- [ ] Searched for existing code before creating new
- [ ] Commit after each completed task
