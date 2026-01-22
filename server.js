import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- INTERVIEW SETUP ---
// You can leave the key in .env, OR paste it here as a string to ensure it works for the interviewer.
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyC0HXyL-Vivde2mWnr257SSCEk0VuaVLI8"; 
// -----------------------

app.use(cors());
app.use(express.json());

app.post('/api/generate-story', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    // ✅ FIXED: Using 'gemini-1.5-flash' (Standard Free Model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const json = await apiRes.json();

    // 1. Handle API Key or Model Errors
    if (json.error) {
      console.error("Google Error:", json.error);
      return res.status(400).json({ error: json.error.message || "API Error" });
    }

    // 2. Handle Empty Responses
    if (!json.candidates || !json.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ error: 'No story generated. AI might be busy.' });
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