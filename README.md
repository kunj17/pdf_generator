# Walkathon Waiver PDF Generator (Forever GitHub Action)

This repo runs a self-respawning GitHub Action every ~6 hours to simulate a forever-running backend.

## Features

- Uses `pdf-lib` to fill walkathon waivers
- Each run respawns itself automatically
- All PDFs stored under `/filled`

## Setup

1. Add a secret named `PAT_TOKEN` with a GitHub token (workflow scope)
2. Push your `Walkathon_fillable.pdf` to `pdf-template/`
3. Trigger the workflow manually from the Actions tab
4. Forever.

## To-Do (Optional Enhancements)

- Add PDF queue polling logic
- Hook up webhook triggers
- Integrate with Apps Script

---
Built with ❤️ by [you].
