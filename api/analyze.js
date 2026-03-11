const Anthropic = require('@anthropic-ai/sdk');
const pdfParse = require('pdf-parse');

const buildPrompt = (contractText) => `You are a senior legal analyst specialising in European real estate law and vacation home co-ownership agreements. You work for MYNE Homes, a PropTech company operating across Germany, Austria, Switzerland, UK, and France.

Analyse the contract below and return a structured JSON response.

CONTRACT DOCUMENT TEXT:
${contractText}

CRITICAL INSTRUCTIONS:
1. Return ONLY raw, valid JSON — no markdown, no code blocks, no explanations, no text before or after the JSON
2. Start your response with { and end with }
3. For any field where information is not found, use "Not specified"
4. overallRiskScore must be a NUMBER between 0 and 100
5. Limit redFlags, yellowFlags, and greenFlags to a maximum of 2 items each (5 total across all three)
6. Keep all text values concise — one or two sentences maximum per field

Return this exact JSON structure:
{
  "extractedData": {
    "parties": {
      "buyer": "Full legal name(s) of buyer(s)",
      "seller": "Full legal name(s) of seller(s)",
      "notary": "Notary name if present",
      "agent": "Agent name if present"
    },
    "propertyAddress": "Complete address",
    "propertyDescription": "Property type, size, key features",
    "purchasePrice": "Total price with currency symbol",
    "paymentSchedule": [
      { "amount": "Amount with currency", "dueDate": "Date or trigger", "description": "What this payment is" }
    ],
    "ownershipShare": "Fraction and percentage",
    "keyDates": [
      { "date": "DD.MM.YYYY", "event": "What happens" }
    ],
    "jurisdiction": "Country and region",
    "governingLaw": "Applicable law or statute"
  },
  "riskIntelligence": {
    "redFlags": [
      { "clause": "Clause name or number", "description": "Why this is a significant risk", "recommendation": "What to do" }
    ],
    "yellowFlags": [
      { "clause": "Clause name or number", "description": "Why this warrants review", "recommendation": "What to check" }
    ],
    "greenFlags": [
      { "clause": "Clause name or number", "description": "Why this protects the buyer" }
    ],
    "overallRiskScore": 40,
    "riskSummary": "One sentence summarising the overall risk level and main concern"
  },
  "obligations": {
    "buyer": [
      { "obligation": "What the buyer must do", "deadline": "When", "consequence": "Penalty if not met" }
    ],
    "seller": [
      { "obligation": "What the seller must do", "deadline": "When", "consequence": "Penalty if not met" }
    ],
    "shared": [
      { "obligation": "Shared obligation", "deadline": "When" }
    ]
  },
  "plainEnglishSummary": "Exactly 3 sentences for a non-lawyer. Sentence 1: what is being bought, who the parties are, and the total price. Sentence 2: key dates, payment structure, and ownership share. Sentence 3: the most important risk or condition to be aware of before signing."
}`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBase64, filename } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    // Decode base64 and parse PDF
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    let contractText;
    try {
      const pdfData = await pdfParse(fileBuffer);
      contractText = pdfData.text;
    } catch (pdfError) {
      return res.status(400).json({
        error:
          'Could not read this PDF. It may be password-protected, corrupted, or an image-only scan. Please use a text-based PDF.',
      });
    }

    if (!contractText || contractText.trim().length < 50) {
      return res.status(400).json({
        error:
          'No readable text found in the PDF. The document may be a scanned image. Please use a text-based PDF or run OCR first.',
      });
    }

    // Limit to 30,000 chars to leave room for the response
    const limitedText = contractText.substring(0, 30000);

    if (!process.env.ANTHROPIC_API_KEY) {
      return res
        .status(500)
        .json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.1,
      messages: [{ role: 'user', content: buildPrompt(limitedText) }],
    });

    const responseText = message.content[0].text;
    console.log('Claude stop_reason:', message.stop_reason);
    console.log('Claude response length:', responseText.length);

    // Extract JSON: strip markdown fences, then find the outermost { ... }
    let cleaned = responseText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
    }

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse failed.');
      console.error('Parse error:', parseError.message);
      console.error('Raw response (first 1000 chars):', responseText.substring(0, 1000));
      console.error('Cleaned snippet (first 1000 chars):', cleaned.substring(0, 1000));
      return res.status(500).json({
        error: 'The AI returned an unexpected response format. Please try again.',
        details: parseError.message,
        rawSnippet: responseText.substring(0, 500),
      });
    }

    return res.json({
      success: true,
      analysis,
      contractText: limitedText,
      filename,
      charCount: contractText.length,
    });
  } catch (error) {
    console.error('Analyze handler error:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred. Please try again.',
    });
  }
};
