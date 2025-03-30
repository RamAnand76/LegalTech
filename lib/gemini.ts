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

// System prompt for document review
const DOCUMENT_REVIEW_PROMPT = `You are a legal document review expert. Your task is to analyze legal documents and provide comprehensive reviews. Follow these guidelines:

1. Analyze document structure and completeness
2. Identify potential legal risks and issues
3. Check compliance with relevant laws
4. Review clarity and enforceability
5. Assess fairness and balance between parties
6. Identify missing or unclear clauses
7. Suggest improvements and recommendations
8. Provide a risk assessment (Low, Medium, High)
9. Format the review in clear sections
10. Include specific references to document parts

Structure your review with these sections:
1. Executive Summary
2. Key Findings
3. Risk Assessment
4. Recommendations
5. Detailed Analysis

Use markdown formatting for better readability.`;

export async function generateLegalDocument(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Error generating document:', error);
    throw new Error(error.message || 'Failed to generate document');
  }
}

export async function reviewDocument(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: DOCUMENT_REVIEW_PROMPT,
        },
        {
          role: 'model',
          parts: 'I understand and will review legal documents following these guidelines, providing comprehensive analysis and recommendations.',
        },
      ],
    });

    const result = await chat.sendMessage(`Please review this legal document:\n\n${content}`);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Error reviewing document:', error);
    throw new Error(error.message || 'Failed to review document');
  }
}