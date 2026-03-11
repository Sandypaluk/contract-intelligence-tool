const Anthropic = require('@anthropic-ai/sdk');

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
    const { question, contractText, chatHistory } = req.body;

    if (!question || !contractText) {
      return res
        .status(400)
        .json({ error: 'Both a question and the contract text are required.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res
        .status(500)
        .json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const historySection =
      chatHistory && chatHistory.length > 0
        ? '\n\n--- PREVIOUS CONVERSATION ---\n' +
          chatHistory
            .map(
              (m) =>
                `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
            )
            .join('\n') +
          '\n--- END OF PREVIOUS CONVERSATION ---'
        : '';

    const prompt = `You are a senior legal analyst at MYNE Homes who has carefully reviewed the following co-ownership contract. Answer the user's question accurately based ONLY on the content of this contract.

CONTRACT TEXT:
${contractText.substring(0, 40000)}
${historySection}

USER QUESTION: ${question}

Guidelines:
- Base your answer strictly on what is written in the contract
- If the answer cannot be found in the contract, say clearly: "This specific point is not addressed in the contract."
- Be specific — reference relevant clause numbers or sections where possible
- Write in clear, plain English without unnecessary legal jargon
- Keep your answer concise but thorough
- If the question involves financial, tax, or complex legal advice, note that the buyer should consult a qualified solicitor or notary in the relevant jurisdiction`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });
    const answer = message.content[0].text;

    return res.json({ success: true, answer });
  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process your question. Please try again.',
    });
  }
};
