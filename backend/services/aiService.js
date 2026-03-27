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

const buildPrompt = ({ week, topic, existingPost }) => `You are an expert technical writer and educator writing for a premium educational publication.

Write a high-quality AI explainer article.

Style rules:
- Do not write like an AI assistant
- Do not summarize mechanically
- Write like a human who deeply understands the topic
- Clear, structured, engaging
- Use real-world examples constantly (Netflix, Spotify, Amazon, YouTube, GitHub Copilot, ChatGPT, Claude when relevant)
- Mix intuition with technical depth
- Avoid hype, fluff, and generic statements
- Every sentence must add value

Mandatory article structure:
1. Title
2. Hook (2-3 short paragraphs with real-world context)
3. Core concept
4. Clear short sections with strong headings
5. Real examples throughout
6. At least 2 clean ASCII visual blocks
7. Strong ending

Formatting rules:
- Write the article body in Markdown
- Use "## " for section headings
- Use short paragraphs
- Use bullet lists when useful
- Wrap ASCII diagrams in fenced code blocks
- Aim for a 5-8 minute read

Topic:
${topic}

Editorial week:
${week}

Existing angle to preserve if useful:
${JSON.stringify(existingPost || {}, null, 2)}

Return plain text using this exact tagged format:
TITLE: <title>
WEEK: ${week}
EXCERPT:
<<<
<2 sentence preview>
>>>
THIS_WEEK:
<<<
<short homepage summary>
>>>
IDEA:
<<<
<single sharp takeaway paragraph>
>>>
SIGNALS:
- <signal 1>
- <signal 2>
- <signal 3>
CONTENT:
<<<
<full markdown article>
>>>`;

const getTaggedSection = (text, tag) => {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escapedTag}:\\s*\\n<<<\\n([\\s\\S]*?)\\n>>>`));
  return match?.[1]?.trim() || "";
};

const normalizeGeneratedPost = (rawText, fallbackWeek) => {
  const title = rawText.match(/^TITLE:\s*(.+)$/m)?.[1]?.trim();
  const week = rawText.match(/^WEEK:\s*(.+)$/m)?.[1]?.trim() || fallbackWeek;
  const excerpt = getTaggedSection(rawText, "EXCERPT");
  const thisWeek = getTaggedSection(rawText, "THIS_WEEK");
  const idea = getTaggedSection(rawText, "IDEA");
  const content = getTaggedSection(rawText, "CONTENT");
  const signalsBlock = rawText.match(/SIGNALS:\s*\n([\s\S]*?)(?:\nCONTENT:)/)?.[1] || "";
  const signals = signalsBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);

  if (!title || !week || !excerpt || !thisWeek || !idea || !content || signals.length < 3) {
    console.error("Gemini Error: Incomplete editorial payload received.");
    return null;
  }

  return {
    title,
    week,
    excerpt,
    thisWeek,
    idea,
    content,
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
      contents: buildPrompt({
        week,
        topic: "Latest shifts in AI this week",
        existingPost: null,
      }),
    });

    const rawText = response.text;

    if (!rawText) {
      console.error("Gemini Error: Empty response body.");
      return null;
    }

    return normalizeGeneratedPost(rawText.trim(), week);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

const rewritePostAsExplainer = async (post) => {
  const ai = getClient();

  if (!ai) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt({
        week: post.week,
        topic: post.title,
        existingPost: {
          title: post.title,
          thisWeek: post.thisWeek,
          idea: post.idea,
          signals: post.signals,
        },
      }),
    });

    const rawText = response.text;

    if (!rawText) {
      console.error("Gemini Error: Empty response body while rewriting post.");
      return null;
    }

    return normalizeGeneratedPost(rawText.trim(), post.week);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

module.exports = {
  generateWeeklyEditorial,
  rewritePostAsExplainer,
};
