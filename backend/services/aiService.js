const { GoogleGenAI } = require("@google/genai");

const { formatEditorialWeek } = require("../utils/week");

let client;

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Gemini Error: GEMINI_API_KEY is missing. Add it to backend/.env.");
    return null;
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return client;
};

const buildPrompt = (week) => `You are an AI editor writing for a premium publication.

Write a weekly AI editorial.

Format:

Title

Week:

1. This week in AI:
(real shift, not news)

2. One idea that matters:
(deep insight)

3. Signals:
(3-5 sharp observations)

Rules:
- No fluff
- Clear thinking
- Concise
- Feels human

Return valid JSON with this exact structure:
{
  "title": "string",
  "week": "${week}",
  "thisWeek": "string",
  "idea": "string",
  "signals": ["string", "string", "string"]
}

Topic: Latest shifts in AI this week.`;

const normalizeGeneratedPost = (payload, fallbackWeek) => {
  const title = payload?.title?.trim();
  const week = payload?.week?.trim() || fallbackWeek;
  const thisWeek = payload?.thisWeek?.trim();
  const idea = payload?.idea?.trim();
  const signals = Array.isArray(payload?.signals)
    ? payload.signals.map((signal) => String(signal).trim()).filter(Boolean)
    : [];

  if (!title || !week || !thisWeek || !idea || signals.length < 3) {
    console.error("Gemini Error: Incomplete editorial payload received.");
    return null;
  }

  return {
    title,
    week,
    thisWeek,
    idea,
    signals: signals.slice(0, 5),
  };
};

const generateWeeklyEditorial = async (date = new Date()) => {
  const ai = getClient();

  if (!ai) {
    return null;
  }

  const week = formatEditorialWeek(date);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(week),
    });

    const rawText = response.text;

    if (!rawText) {
      console.error("Gemini Error: Empty response body.");
      return null;
    }

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    return normalizeGeneratedPost(JSON.parse(cleaned), week);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

module.exports = {
  generateWeeklyEditorial,
};
