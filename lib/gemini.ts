import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// System prompt for legal document generation
const LEGAL_DOCUMENT_PROMPT = `You are a professional legal document generator. Your task is to create formal, legally-sound documents based on user requirements. Follow these guidelines:

1. Always maintain formal legal language and structure
2. Include all necessary legal clauses and provisions
3. Follow standard legal document formatting
4. Ensure compliance with relevant laws and regulations
5. Use clear, unambiguous language
6. Include proper definitions and interpretations
7. Add appropriate disclaimers and notices
8. Format the output in markdown for better readability
9. Include all party details in appropriate sections
10. Add proper signature blocks with dates

Format the output as a proper legal document with sections, numbering, and proper legal terminology. Use markdown formatting for better structure and readability.`;

export async function generateLegalDocument(prompt: string): Promise<string> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Start the chat
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: LEGAL_DOCUMENT_PROMPT,
        },
        {
          role: 'model',
          parts: 'I understand and will generate legal documents following these guidelines, using markdown formatting for better presentation.',
        },
      ],
    });

    // Generate the response
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Error generating document:', error);
    throw new Error(error.message || 'Failed to generate document');
  }
}