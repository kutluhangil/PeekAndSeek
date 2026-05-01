import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { lat, lng, key } = req.query;

    if (!lat || !lng || !key) {
      return res.status(400).json({ error: "Missing lat, lng, or key" });
    }

    const url = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${key}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error(`Streetview API Error (${response.status}):`, text);
      if (response.status === 403) {
        return res.status(403).json({
          error: "Street View Static API is not enabled for this API key.",
        });
      }
      return res
        .status(response.status)
        .json({ error: `Failed to fetch image: ${response.statusText}` });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Cache for 1 hour
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({ base64 });
  } catch (error) {
    console.error("Error fetching streetview:", error);
    res.status(500).json({ error: "Failed to fetch streetview image" });
  }
}
