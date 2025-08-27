import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { title, keywords, platform } = req.body;
  if (!title || !keywords) return res.status(400).json({ error: "Missing fields" });

  try {
    const prompt = `Generate SEO tags, hashtags, and description for a ${platform} video.
    Title: ${title}
    Keywords: ${keywords}`;

    const apiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await apiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.status(200).json({
      tags: text.split("\n").filter(l => l.startsWith("Tags:"))[0] || "",
      hashtags: text.split("\n").filter(l => l.startsWith("Hashtags:"))[0] || "",
      description: text
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch from Gemini API" });
  }
}