<<div align="center">
  <img width="1200" height="475" alt="PolicyPal Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PolicyPal Frontend

**PolicyPal** is a conversational health coverage assistant built with **Gemini in Google AI Studio** and deployed on **Cloud Run**. It helps users understand their health plan by answering natural language questions like:

> “Am I covered for antenatal care?”  
> “What does my BlueFamily plan include?”


## Tech Stack

- **Core Language**: TypeScript
- **UI Framework**: React
- **Styling**: Tailwind CSS (loaded via CDN)**
- **AI Service**: Google Gemini API (@google/genai library)
- **Module System**: ES Modules with an importmap for CDN-based dependencies (React, Gemini API, etc.)
- **Markdown Parsing**: marked library (for rendering assistant's responses)
- **HTML Sanitization**: DOMPurify (to securely render the parsed markdown)
- **Client-side Storage**: localStorage API (for persisting chat history)
- **Deployment**: Cloud Run
- **Backend**: Python API (coming soon)

---

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Security Notes

- Do **not** commit `.env.local` to GitHub — it contains your Gemini API key
- `.env.local` is already listed in `.gitignore` to prevent accidental uploads
- Always keep your API keys and secrets private