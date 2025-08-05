import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/generate-story', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const json = await apiRes.json();
    if (!json.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini returned unexpected format', json);
      return res.status(500).json({ error: 'No story generated' });
    }

    const story = json.candidates[0].content.parts[0].text;
    res.json({ story: story.trim() });

  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ error: 'Story generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
