// client-side code
import { reviewDocument } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { Contract } from '@/lib/types/contracts';

// This function will call our API endpoint instead of directly parsing the PDF
export async function extractPdfText(url: string): Promise<string> {
  try {
    // Create a new API route to handle PDF parsing server-side
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdfUrl: url }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to parse PDF');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function processContractReview(contract: Contract): Promise<string> {
  try {
    // Update contract status to in_review first
    const { error: startError } = await supabase
      .from('contracts')
      .update({ status: 'in_review' })
      .eq('id', contract.id);

    if (startError) throw startError;

    // Get signed URL for the contract file
    const { data: urlData, error: urlError } = await supabase.storage
      .from('contracts')
      .createSignedUrl(contract.file_path, 60);

    if (urlError) throw urlError;

    // Extract text based on file type
    let content = '';
    if (contract.file_type === 'application/pdf') {
      content = await extractPdfText(urlData.signedUrl);
    } else {
      const response = await fetch(urlData.signedUrl);
      content = await response.text();
    }

    // Get AI review of the content
    const review = await reviewDocument(content);

    // Create sections for the review
    const sections = [
      "# Contract Review Summary\n\n",
      "## Key Terms and Definitions\n" + review + "\n\n",
      "## Obligations and Responsibilities\n" + review + "\n\n",
      "## Risk Assessment\n" + review + "\n\n",
      "## Recommendations\n" + review + "\n\n"
    ].join('');

    // Update contract status and store review in a transaction-like manner
    const { error: reviewError } = await supabase
      .from('contract_reviews')
      .insert({
        contract_id: contract.id,
        review_content: sections,
        created_at: new Date().toISOString()
      });

    return review;
  } catch (error) {
    // If anything fails, revert status to pending
    await supabase
      .from('contracts')
      .update({ status: 'pending' })
      .eq('id', contract.id);

    console.error('Error processing contract review:', error);
    throw error;
  }
}