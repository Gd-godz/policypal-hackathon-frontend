<<div align="center">
  <img width="1200" height="475" alt="PolicyPal Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
Please note that this project works with a backend which can be viewed at this repository: https://github.com/Gd-godz/policypal-hackathon-backend.git

# PolicyPal Frontend

**PolicyPal** is an AI-powered assistant that helps users instantly understand their health insurance coverage. Built with **Google Gemini in Google AI Studio**, **Cloud Functions**, and **Google Sheets**, it delivers factual, real-time answers about health plan benefits in natural language. Deployed on **Google Cloud Run**, PolicyPal reimagines how people access transparent healthcare information.
It helps users understand their health plan by answering natural language questions like:

> “Am I covered for antenatal care?”  
> “What does my BlueFamily plan include?”

**Tool Schemas used by Gemini**
1. **checkCoverge tool

```
{
  "name": "checkCoverage",
  "description": "Checks if a specific procedure is covered under a health plan",
  "parameters": {
    "type": "object",
    "properties": {
      "plan": {
        "type": "string",
        "description": "The name of the health insurance plan"
      },
      "item": {
        "type": "string",
        "description": "The procedure or treatment to check"
      }
    },
    "required": ["plan", "item"]
  }
}
```

2. **listCoveredProcedures**

```
{
  "name": "listCoveredProcedures",
  "description": "Lists all procedures covered under a health plan",
  "parameters": {
    "type": "object",
    "properties": {
      "plan": {
        "type": "string",
        "description": "The name of the health insurance plan"
      }
    },
    "required": ["plan"]
  }
}
```

## Tech Stack
- **Google AI Studio Platform**
- **Core Language**: TypeScript
- **UI Framework**: React
- **Styling**: Tailwind CSS (loaded via CDN)**
- **AI Service**: Google Gemini API (@google/genai library)
- **Module System**: ES Modules with an importmap for CDN-based dependencies (React, Gemini API, etc.)
- **Markdown Parsing**: marked library (for rendering assistant's responses)
- **HTML Sanitization**: DOMPurify (to securely render the parsed markdown)
- **Client-side Storage**: localStorage API (for persisting chat history)
- **Deployment**: Cloud Run
- **Backend**: Python API on Cloud Functions - check the backend repo @ https://github.com/Gd-godz/policypal-hackathon-backend.git

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

Related Repo (PolicyPal Backend): https://github.com/Gd-godz/policypal-hackathon-backend.git