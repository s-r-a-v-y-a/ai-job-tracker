const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function askClaude(prompt) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = message.content[0].text;
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}
// RESUME SCORER
router.post('/score-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    const prompt = `You are an ATS expert. Analyze this resume and return ONLY a JSON object, no markdown, no backticks, just pure JSON:
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"],
  "summary": "<one sentence summary>"
}

Resume:
${resumeText}`;

    const text = await askClaude(prompt);
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to score resume' });
  }
});

// COVER LETTER GENERATOR
router.post('/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobTitle, company, jobDescription } = req.body;
    const prompt = `Write a professional cover letter for a ${jobTitle} position at ${company}.

Job Description: ${jobDescription}

Resume: ${resumeText}

Write a compelling, specific cover letter under 350 words.
Use details from both the resume and job description.
Return only the cover letter text, no subject line, no extra formatting.`;

    const text = await askClaude(prompt);
    res.json({ coverLetter: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// INTERVIEW PREP
router.post('/interview-prep', async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const prompt = `Generate 8 likely interview questions for a ${jobTitle} role.

Job Description: ${jobDescription}

Return ONLY a JSON array, no markdown, no backticks, just pure JSON:
[
  {
    "question": "question here",
    "answer": "model answer using STAR method where relevant"
  }
]`;

    const text = await askClaude(prompt);
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate interview prep' });
  }
});

// RESUME JOB MATCH
router.post('/match', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const prompt = `Analyze how well this resume matches the job description.
Return ONLY a JSON object, no markdown, no backticks, just pure JSON:
{
  "matchScore": <number 0-100>,
  "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "topSuggestion": "<one specific actionable suggestion>"
}

Resume: ${resumeText}

Job Description: ${jobDescription}`;

    const text = await askClaude(prompt);
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to match resume' });
  }
});

module.exports = router;