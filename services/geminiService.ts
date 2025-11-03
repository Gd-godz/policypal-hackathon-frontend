

import { GoogleGenAI, FunctionDeclaration, Type, Chat, GenerateContentResponse, Part } from "@google/genai";
import { PlanTier, ChatResponse, CoverageData, ProcedureListData } from '../types';

// This function now calls the external Google Cloud Function.
const checkCoverage = async ({ procedure, plan_tier }: { procedure: string, plan_tier: PlanTier }): Promise<CoverageData | { error: string }> => {
  console.log(`Checking coverage for procedure: "${procedure}" on plan: "${plan_tier}" via Cloud Function.`);
  
  const cloudFunctionUrl = 'https://us-central1-crested-idiom-305022.cloudfunctions.net/check_coverage';
  
  try {
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        procedure: procedure,
        plan_tier: plan_tier,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from cloud function: ${response.status} ${errorText}`);
      return { error: `Failed to fetch coverage data. Status: ${response.status}` };
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error calling the cloud function:", error);
    return { error: "An error occurred while communicating with the coverage service." };
  }
};

const listCoveredProcedures = async ({ plan_tier }: { plan_tier: PlanTier }): Promise<ProcedureListData | { error: string }> => {
  console.log(`Listing covered procedures for plan: "${plan_tier}" via Cloud Function.`);
  
  const cloudFunctionUrl = 'https://us-central1-crested-idiom-305022.cloudfunctions.net/check_coverage';
  
  try {
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_tier: plan_tier,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from cloud function: ${response.status} ${errorText}`);
      return { error: `Failed to fetch covered procedures. Status: ${response.status}` };
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error calling the list_covered_procedures cloud function:", error);
    return { error: "An error occurred while communicating with the coverage service." };
  }
};

const checkCoverageFunctionDeclaration: FunctionDeclaration = {
  name: 'checkCoverage',
  description: "Checks if a specific medical procedure is covered by the user's health plan and what the limit is.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      procedure: {
        type: Type.STRING,
        description: 'The medical procedure to check coverage for (e.g., "dental surgery", "physiotherapy").',
      },
      plan_tier: {
        type: Type.STRING,
        description: 'The user\'s full health plan tier, as provided by them (e.g., "Blue/Family", "Gold/Individual").',
      },
    },
    required: ['procedure', 'plan_tier'],
  },
};

const listCoveredProceduresFunctionDeclaration: FunctionDeclaration = {
  name: 'listCoveredProcedures',
  description: "Returns all procedures covered by the user's health plan tier.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      plan_tier: {
        type: Type.STRING,
        description: "The user's full health plan tier (e.g., 'Blue/Family')",
      },
    },
    required: ['plan_tier'],
  },
};

const systemInstruction = `You are PolicyPal, a helpful and knowledgeable health coverage assistant. You have three tools: 'checkCoverage', 'listCoveredProcedures', and 'googleSearch'.

**Your Primary Job: Health Plan Assistance**
- For **specific procedure questions** (e.g., "is dental surgery covered?"), you **MUST** use the \`checkCoverage\` tool.
- For **general coverage questions** (e.g., "what am I covered for?", "list all my benefits"), you **MUST** use the \`listCoveredProcedures\` tool.

**Your Secondary Job: General Health Questions**
- For all other health questions (symptoms, definitions, treatments), use \`googleSearch\`.

**Response Guidelines:**
- After a tool is used, you will receive its output. Your job is to summarize this output in a friendly, natural, and helpful way.
- **Currency:** When mentioning any monetary values or limits, you **MUST** use the Nigerian Naira symbol (₦). For example, "Your limit is ₦150,000 per year."
- If the \`checkCoverage\` tool returns data, explain the coverage status and any limits clearly.
- If the \`listCoveredProcedures\` tool returns a list, provide a brief introductory sentence like "Here are the procedures covered under your plan:". The app will display the full list in a card.
- If you use \`googleSearch\`, provide a helpful summary of the search results.
- **IMPORTANT:** Your response must be plain text. Do NOT output JSON. Use Markdown for formatting (like bolding) if needed.
`;


let chat: Chat | null = null;

export const resetChat = () => {
    chat = null;
};

const initializeChat = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: [checkCoverageFunctionDeclaration, listCoveredProceduresFunctionDeclaration] }, { googleSearch: {} }],
        },
    });
};

export const runChat = async (newMessage: string): Promise<ChatResponse> => {
    if (!chat) {
        initializeChat();
    }
    
    if (!chat) { // Should not happen after initialization
       throw new Error("Chat could not be initialized.");
    }

    try {
        let cardData: CoverageData | undefined;
        let procedureListData: ProcedureListData | undefined;

        let response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });

        // Handle function calls from the model
        while (response.functionCalls && response.functionCalls.length > 0) {
            const functionCalls = response.functionCalls;
            const toolResponseParts: Part[] = [];

            for (const fc of functionCalls) {
                if (fc.name === 'checkCoverage') {
                    const { procedure, plan_tier } = fc.args as { procedure: string, plan_tier: PlanTier };
                    
                    if (!procedure || !plan_tier) {
                         toolResponseParts.push({ functionResponse: { name: fc.name, response: { error: "Missing required arguments." } } });
                         continue;
                    }

                    const result = await checkCoverage({ procedure, plan_tier });
                    if ('covered' in result) cardData = result; // Capture data for the card
                    // Fix: Cast `result` to satisfy the type expected by functionResponse.response.
                    toolResponseParts.push({ functionResponse: { name: fc.name, response: result as Record<string, unknown> } });

                } else if (fc.name === 'listCoveredProcedures') {
                     const { plan_tier } = fc.args as { plan_tier: PlanTier };
                    if (!plan_tier) {
                        toolResponseParts.push({ functionResponse: { name: fc.name, response: { error: "Missing plan_tier." } } });
                        continue;
                    }
                    const result = await listCoveredProcedures({ plan_tier });
                    if ('procedures' in result) procedureListData = result; // Capture data for the list card
                    // Fix: Cast `result` to satisfy the type expected by functionResponse.response.
                    toolResponseParts.push({ functionResponse: { name: fc.name, response: result as Record<string, unknown> } });
                }
            }

            // Send tool results back to the model
            // FIX: The argument to `sendMessage` must be of type `SendMessageParameters`, which requires the content to be wrapped in a `message` property.
            response = await chat.sendMessage({ message: toolResponseParts });
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const citations = groundingChunks
            ?.map(chunk => chunk.web)
            .filter(web => web?.uri && web.title)
            .map(web => ({ uri: web.uri as string, title: web.title as string })) || [];

        return {
            responseText: response.text,
            cardData,
            procedureListData,
            citations: citations.length > 0 ? citations : undefined,
        };

    } catch (error) {
        console.error("Error in runChat:", error);
        throw new Error("I'm sorry, but I encountered a technical issue while connecting to the AI service. Please check your internet connection and try again.");
    }
};