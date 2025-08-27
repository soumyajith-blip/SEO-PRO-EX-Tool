import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, keywords, platform } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API key." });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful SEO assistant." },
        { role: "user", content: `Generate SEO tags, hashtags, and a description for:
        Title: ${title}
        Keywords: ${keywords}
        Platform: ${platform}` }
      ]
    });

    const text = completion.choices[0].message.content;

    res.status(200).json({
      tags: keywords.split(",").map(k => k.trim()).join(", "),
      hashtags: "#" + keywords.split(",").map(k => k.trim().replace(/\s+/g, "")).join(" #"),
      description: text
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
