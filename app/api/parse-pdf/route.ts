// app/api/parse-pdf/route.ts (Next.js 13+ app directory)
import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl } = await request.json();
    
    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required' },
        { status: 400 }
      );
    }
    
    // Fetch the PDF content
    const pdfResponse = await fetch(pdfUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    // Parse the PDF using pdf2json
    const text = await parsePdf(Buffer.from(pdfBuffer));
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}

// Helper function to parse PDF using pdf2json
function parsePdf(pdfBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(errData.parserError));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from the parsed PDF data
        let fullText = '';
        
        // Process each page
        for (const page of pdfData.Pages) {
          const pageText = page.Texts.map((textItem: any) => {
            // Decode the text (pdf2json encodes spaces as '_' and other special chars)
            return decodeURIComponent(textItem.R.map((r: any) => r.T).join(' '));
          }).join(' ');
          
          fullText += pageText + '\n\n';
        }
        
        resolve(fullText);
      } catch (error) {
        reject(error);
      }
    });
    
    // Parse the PDF from the buffer
    pdfParser.parseBuffer(pdfBuffer);
  });
}