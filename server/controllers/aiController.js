import { GoogleGenerativeAI } from '@google/generative-ai';

// POST /api/ai/cover-letter
export const generateCoverLetter = async (req, res) => {
  const { company, role, description } = req.body;

  if (!company || !role) {
    return res.status(400).json({ message: 'Company and role are required' });
  }

  const prompt = `Write a concise, professional cover letter for the role of "${role}" at "${company}".
${description ? `Here is the job description:\n${description}\n` : ''}
Requirements:
- Under 250 words
- Sound natural and human, not AI-generated
- Start with a strong opening line (not "I am writing to apply")
- Mention one specific reason you are excited about this company
- End with a clear call to action`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ coverLetter: text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
};
