import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
}

function parseBloomJson(rawText) {
  if (!rawText) {
    throw new Error("Empty Gemini response");
  }

  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

const fallbackVibes = [
  {
    keywords: ["rain", "night", "alone", "overthinking"],
    data: {
      title: "Midnight Rain Thoughts",
      subtitle: "A quiet bloom of moonlit reflection",
      flower: "Blue Hydrangea",
      weather: "Soft rain after midnight",
      songEnergy: "Slow-burning indie ache",
      era: "Late-night Tumblr winter",
      description:
        "You turn quiet sadness into cinematic beauty. Your emotions feel like soft rain against neon windows.",
      whyThisVibe:
        "You process feelings in private and turn solitude into something tender, symbolic, and strangely beautiful.",
      feelsLike: ["rain tapping on a window", "unread thoughts at 1:13 a.m.", "moonlight on a cold floor"],
      tags: ["#rainy-night", "#overthinker", "#soft-healing", "#late-night-thoughts"],
      palette: ["#0f172a", "#4338ca", "#c084fc"],
      music: {
        title: "Sweater Weather",
        artist: "The Neighbourhood",
        spotifySearch: "https://open.spotify.com/search/Sweater%20Weather%20The%20Neighbourhood",
        youtubeSearch: "https://www.youtube.com/results?search_query=Sweater+Weather+The+Neighbourhood"
      },
      moodMeter: { nostalgia: 82, healing: 48, chaos: 22, comfort: 58, loneliness: 79, hope: 54 },
      relatedPrompt: "Try another memory like: watching city lights through rain on the train home."
    }
  },
  {
    keywords: ["friends", "wedding", "cousins", "laughing"],
    data: {
      title: "Golden Chaos Memories",
      subtitle: "Joy that arrives loud and stays warm",
      flower: "Marigold",
      weather: "Warm sunlight after a busy afternoon",
      songEnergy: "Joyful singalong chaos",
      era: "Family-camera flash era",
      description:
        "Your happiest memories are loud, messy, warm, and full of people you never want to lose.",
      whyThisVibe:
        "Your heart keeps its best moments in motion: laughter, noise, moving bodies, and the feeling that love was everywhere at once.",
      feelsLike: ["confetti in your hair", "a photo taken mid-laugh", "someone calling your name from across the room"],
      tags: ["#family-chaos", "#golden-hour", "#memory-core", "#laughing-too-loud"],
      palette: ["#f59e0b", "#fb7185", "#f97316"],
      music: {
        title: "Yellow",
        artist: "Coldplay",
        spotifySearch: "https://open.spotify.com/search/Yellow%20Coldplay",
        youtubeSearch: "https://www.youtube.com/results?search_query=Yellow+Coldplay"
      },
      moodMeter: { nostalgia: 68, healing: 74, chaos: 77, comfort: 83, loneliness: 18, hope: 88 },
      relatedPrompt: "Try another memory like: a wedding night that felt bigger than your whole childhood."
    }
  },
  {
    keywords: ["music", "movie", "drive"],
    data: {
      title: "Main Character Energy",
      subtitle: "Cinematic, romantic, and a little unreal",
      flower: "Wild rose",
      weather: "Clear evening with a breeze through the car window",
      songEnergy: "Cinematic road-trip pulse",
      era: "Indie film soundtrack era",
      description:
        "You romanticize life through songs, sunsets, and tiny emotional moments nobody else notices.",
      whyThisVibe:
        "You naturally frame ordinary moments like scenes, and your emotions tend to arrive with a soundtrack already attached.",
      feelsLike: ["passing streetlights on a night drive", "a song you know every word to", "the moment before a movie scene changes"],
      tags: ["#late-night-drives", "#music-core", "#cinematic-heart", "#blue-hour"],
      palette: ["#1e293b", "#7c3aed", "#ec4899"],
      music: {
        title: "505",
        artist: "Arctic Monkeys",
        spotifySearch: "https://open.spotify.com/search/505%20Arctic%20Monkeys",
        youtubeSearch: "https://www.youtube.com/results?search_query=505+Arctic+Monkeys"
      },
      moodMeter: { nostalgia: 71, healing: 42, chaos: 29, comfort: 56, loneliness: 46, hope: 61 },
      relatedPrompt: "Try another memory like: the song that made a random evening feel like a film scene."
    }
  }
];

function generateFallback(memory = "") {
  const lower = memory.toLowerCase();

  for (const vibe of fallbackVibes) {
    if (vibe.keywords.some((word) => lower.includes(word))) {
      const copy = { ...vibe.data };
      copy.imagePrompt = buildAtmospherePrompt(copy);
      return copy;
    }
  }

  const fallback = {
    title: "Soft Soul Energy",
    subtitle: "A tender bloom of quiet feeling",
    flower: "Lavender",
    weather: "Blue-gray evening air",
    songEnergy: "Gentle, wistful, and glowing",
    era: "Diary page nostalgia",
    description:
      "You find emotional meaning in ordinary moments and quietly carry entire worlds inside your head.",
    whyThisVibe:
      "Your memories bloom slowly, with layers of feeling that reveal themselves only when the room gets quiet.",
    feelsLike: ["a handwritten note tucked in a book", "sunlight through curtains", "thinking about someone after midnight"],
    tags: ["#soft-healing", "#nostalgia", "#moonlit-thoughts", "#poetry-core"],
    palette: ["#6366f1", "#ec4899", "#8b5cf6"],
    music: {
      title: "Space Song",
      artist: "Beach House",
      spotifySearch: "https://open.spotify.com/search/Space%20Song%20Beach%20House",
      youtubeSearch: "https://www.youtube.com/results?search_query=Space+Song+Beach+House"
    },
    moodMeter: { nostalgia: 76, healing: 62, chaos: 18, comfort: 69, loneliness: 41, hope: 72 },
    relatedPrompt: "Try another memory like: a place that still feels like a memory even when you return there."
  };

  fallback.imagePrompt = buildAtmospherePrompt(fallback);

  return fallback;
}

function buildMemoryBloomPrompt(memory) {
  return `
You are an emotional symbolism engine for a mobile-first experience called Memory Bloom.

Interpret the memory below into a poetic, symbolic, deeply relatable JSON object.
Do not mention that you are AI. Do not be technical. Avoid chatbot language.

Memory:
"${memory}"

Return ONLY valid JSON with this exact schema:
{
  "title": "",
  "subtitle": "",
  "flower": "",
  "weather": "",
  "songEnergy": "",
  "era": "",
  "description": "",
  "whyThisVibe": "",
  "feelsLike": ["", "", ""],
  "tags": ["", "", "", "", "", ""],
  "palette": ["#000000", "#000000", "#000000"],
  "music": {
    "title": "",
    "artist": "",
    "spotifySearch": "",
    "youtubeSearch": ""
  },
  "moodMeter": {
    "nostalgia": 0,
    "healing": 0,
    "chaos": 0,
    "comfort": 0,
    "loneliness": 0,
    "hope": 0
  },
  "relatedPrompt": ""
}

Make the language poetic, symbolic, and timeless.
`;
}

function normalizeBloomPayload(rawPayload, memory = "") {
  const fallback = generateFallback(memory);

  if (!rawPayload || typeof rawPayload !== "object") {
    const mergedFallback = { ...fallback };
    mergedFallback.imagePrompt = buildAtmospherePrompt(mergedFallback);
    return mergedFallback;
  }
  const merged = {
    ...fallback,
    ...rawPayload,
    feelsLike: Array.isArray(rawPayload.feelsLike) && rawPayload.feelsLike.length ? rawPayload.feelsLike : fallback.feelsLike,
    tags: Array.isArray(rawPayload.tags) && rawPayload.tags.length ? rawPayload.tags : fallback.tags,
    palette: Array.isArray(rawPayload.palette) && rawPayload.palette.length === 3 ? rawPayload.palette : fallback.palette,
    music: {
      ...fallback.music,
      ...(rawPayload.music || {})
    },
    moodMeter: {
      ...fallback.moodMeter,
      ...(rawPayload.moodMeter || {})
    },
    relatedPrompt: rawPayload.relatedPrompt || fallback.relatedPrompt
  };

  merged.imagePrompt = buildAtmospherePrompt(merged);

  return merged;
}

function buildAtmospherePrompt(bloom) {
  // Compose a single cinematic, mobile-first image prompt based on the bloom
  const parts = [];

  // Base atmosphere
  parts.push("Vertical 9:16 cinematic atmosphere, mobile-first story screenshot aesthetic");
  parts.push("soft cinematic lighting, dreamy gradients, moonlight glow, subtle film grain, watercolor textures, vintage paper texture, soft focus photography");

  // Symbolic elements
  if (bloom.flower) parts.push(`${bloom.flower} as a symbolic motif`);
  if (bloom.weather) parts.push(`${bloom.weather} atmosphere`);
  if (bloom.era) parts.push(`${bloom.era} nostalgic era hint`);
  if (bloom.songEnergy) parts.push(`${bloom.songEnergy} energy, gentle rhythmic motion`);

  // Feels like and tags for sensory hints
  if (Array.isArray(bloom.feelsLike) && bloom.feelsLike.length) parts.push(`${bloom.feelsLike.slice(0,3).join(', ')} – sensory fragments`);
  if (Array.isArray(bloom.tags) && bloom.tags.length) parts.push(`${bloom.tags.slice(0,4).join(', ')} – mood tags`);

  // Mood intensity: pick strongest mood for guiding tone
  if (bloom.moodMeter && typeof bloom.moodMeter === 'object') {
    const entries = Object.entries(bloom.moodMeter).filter(([,v]) => typeof v === 'number');
    if (entries.length) {
      entries.sort((a,b) => b[1] - a[1]);
      const top = entries[0][0];
      parts.push(`${top} forward, emotive and atmospheric`);
    }
  }

  // Palette hint
  if (Array.isArray(bloom.palette) && bloom.palette.length) {
    parts.push(`color palette: ${bloom.palette.join(', ')}`);
  }

  // Composition guidance
  parts.push("layered lighting, negative space, cinematic framing, subtle symbolism, minimal human presence (no close-up faces)");

  // Explicit style constraints and avoidances
  parts.push("avoid anime, avoid hyper-realistic faces, avoid obvious AI styles, avoid text, avoid meme aesthetics, avoid fantasy overload, avoid clutter");

  // Final emotional phrasing
  parts.push(`poetic, symbolic, timeless, like a memory someone forgot they still carried`);

  return parts.join('. ');
}

async function generateWithFallbackModels(client, prompt) {
  const candidates = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash-latest", "gemini-1.5-flash"];
  let lastError = null;

  for (const modelName of candidates) {
    try {
      const model = client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      if (error?.status === 404) {
        continue;
      }
      if (error?.status === 429 || error?.code === 429) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("No supported Gemini model found");
}

async function generateImageFromPrompt(prompt) {
  const token = process.env.REPLICATE_API_TOKEN;
  const modelVersion = process.env.REPLICATE_MODEL_VERSION;

  if (!token || !modelVersion) {
    return null;
  }

  try {
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: modelVersion,
        input: {
          prompt,
          width: 1024,
          height: 1792
        }
      })
    });

    if (!createRes.ok) {
      console.error("Replicate create failed", await createRes.text());
      return null;
    }

    const created = await createRes.json();
    const id = created.id;

    // Poll for completion
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: { Authorization: `Token ${token}` }
      });

      if (!statusRes.ok) {
        console.error("Replicate status failed", await statusRes.text());
        return null;
      }

      const status = await statusRes.json();
      if (status.status === "succeeded" && status.output && status.output.length) {
        const imageUrl = status.output[0];
        // fetch image and convert to data URL
        const imgRes = await fetch(imageUrl);
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mime = imgRes.headers.get("content-type") || "image/png";
        return { dataUrl: `data:${mime};base64,${base64}`, url: imageUrl };
      }

      if (status.status === "failed") {
        console.error("Replicate generation failed", status);
        return null;
      }
    }

    console.error("Replicate generation timed out");
    return null;
  } catch (err) {
    console.error("Replicate error", err);
    return null;
  }
}

router.post("/", async (req, res) => {
  try {
    const { memory } = req.body;
    const client = getGeminiClient();

    if (!client) {
      const fallback = generateFallback(memory);
      // If the request asked to generate an image, attempt it (best-effort)
      if (req.body?.generateImage && process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_MODEL_VERSION) {
        const img = await generateImageFromPrompt(fallback.imagePrompt);
        if (img) fallback.image = img.dataUrl;
      }

      return res.json(fallback);
    }

    const responseText = await generateWithFallbackModels(client, buildMemoryBloomPrompt(memory));
    const bloom = normalizeBloomPayload(parseBloomJson(responseText), memory);

    // If client requested image generation, attempt to generate using Replicate
    if (req.body?.generateImage && process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_MODEL_VERSION) {
      const img = await generateImageFromPrompt(bloom.imagePrompt);
      if (img) bloom.image = img.dataUrl;
    }

    return res.json(bloom);
  } catch (error) {
    console.error(error);
    return res.json(generateFallback(req.body?.memory || ""));
  }
});

export default router;
