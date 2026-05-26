import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

function parseSoulbloomJson(rawText) {
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

function getCharacterColor(character = "") {
  const key = character.toLowerCase();

  if (key.includes("spider-man") || key.includes("spiderman") || key.includes("peter parker")) return "#ef4444";
  if (key.includes("captain america") || key.includes("steve rogers")) return "#60a5fa";
  if (key.includes("iron man") || key.includes("tony stark")) return "#f97316";
  if (key.includes("thor")) return "#93c5fd";
  if (key.includes("black panther")) return "#0f172a";
  if (key.includes("doctor strange")) return "#8b5cf6";
  if (key.includes("loki")) return "#22c55e";
  if (key.includes("chandler bing")) return "#60a5fa";
  if (key.includes("phoebe buffay")) return "#f472b6";
  if (key.includes("joey tribbiani")) return "#f59e0b";
  if (key.includes("ross geller")) return "#38bdf8";
  if (key.includes("wednesday addams")) return "#334155";
  if (key.includes("enid sinclair")) return "#f9a8d4";
  if (key.includes("rapunzel")) return "#f59e0b";
  if (key.includes("luna lovegood")) return "#a78bfa";
  if (key.includes("elsa")) return "#7dd3fc";
  if (key.includes("moana")) return "#06b6d4";
  if (key.includes("shinchan")) return "#fb7185";
  if (key.includes("doraemon")) return "#38bdf8";
  if (key.includes("naruto")) return "#f59e0b";
  if (key.includes("hermione granger")) return "#8b5cf6";

  return "#9b8cff";
}

function getCharacterPalette(character = "") {
  const key = character.toLowerCase();

  if (key.includes("spider-man") || key.includes("spiderman") || key.includes("peter parker")) return ["#ef4444", "#2563eb", "#0f172a"];
  if (key.includes("captain america") || key.includes("steve rogers")) return ["#60a5fa", "#e2e8f0", "#1e293b"];
  if (key.includes("iron man") || key.includes("tony stark")) return ["#f97316", "#fde68a", "#7c2d12"];
  if (key.includes("thor")) return ["#93c5fd", "#c4b5fd", "#1e3a8a"];
  if (key.includes("black panther")) return ["#0f172a", "#475569", "#111827"];
  if (key.includes("doctor strange")) return ["#8b5cf6", "#60a5fa", "#111827"];
  if (key.includes("loki")) return ["#22c55e", "#facc15", "#14532d"];
  if (key.includes("chandler bing")) return ["#60a5fa", "#e2e8f0", "#1e293b"];
  if (key.includes("phoebe buffay")) return ["#f472b6", "#f9a8d4", "#7c3aed"];
  if (key.includes("joey tribbiani")) return ["#f59e0b", "#fcd34d", "#7c2d12"];
  if (key.includes("ross geller")) return ["#38bdf8", "#cbd5e1", "#0f172a"];
  if (key.includes("wednesday addams")) return ["#334155", "#0f172a", "#7c3aed"];
  if (key.includes("enid sinclair")) return ["#f9a8d4", "#a78bfa", "#1e1b4b"];
  if (key.includes("hermione granger")) return ["#8b5cf6", "#f59e0b", "#1e1b4b"];
  if (key.includes("spider-man") || key.includes("spiderman") || key.includes("peter parker")) return ["#ef4444", "#2563eb", "#0f172a"];
  if (key.includes("elsa")) return ["#7dd3fc", "#e0f2fe", "#1d4ed8"];
  if (key.includes("rapunzel")) return ["#f59e0b", "#f472b6", "#7c3aed"];
  if (key.includes("luna lovegood")) return ["#a78bfa", "#93c5fd", "#111827"];
  if (key.includes("moana")) return ["#06b6d4", "#fb7185", "#0f172a"];
  if (key.includes("shinchan")) return ["#fb7185", "#f59e0b", "#1e293b"];
  if (key.includes("doraemon")) return ["#38bdf8", "#e0f2fe", "#1e3a8a"];
  if (key.includes("naruto")) return ["#f59e0b", "#fb7185", "#1e1b4b"];

  return ["#9b8cff", "#60a5fa", "#0f172a"];
}

function attachCharacterColor(payload) {
  return {
    ...payload,
    characterColor: getCharacterColor(payload.character),
    characterPalette: getCharacterPalette(payload.character)
  };
}

const characterPools = {
  avengersInspired: {
    hopeful: ["Spider-Man", "Captain America", "Iron Man", "Thor", "Black Panther", "Doctor Strange", "Ant-Man", "Vision", "Hawkeye", "Falcon"],
    funny: ["Spider-Man", "Ant-Man", "Rocket Raccoon", "Star-Lord", "Thor", "Deadpool", "Korg", "Groot", "Loki", "Wong"],
    calm: ["Vision", "Captain America", "Black Panther", "Bruce Banner", "Hawkeye", "Falcon", "Gamora", "Mantis", "Shuri", "Bucky Barnes"],
    confident: ["Iron Man", "Thor", "Black Widow", "Captain Marvel", "Doctor Strange", "Black Panther", "Scarlet Witch", "Loki", "Star-Lord", "Nick Fury"],
    thoughtful: ["Spider-Man", "Bruce Banner", "Vision", "Doctor Strange", "Bucky Barnes", "Wanda Maximoff", "Gamora", "Peter Quill", "Moon Knight", "Shuri"]
  },
  friendsInspired: {
    comforting: ["Chandler Bing", "Monica Geller", "Rachel Green", "Phoebe Buffay", "Joey Tribbiani", "Ross Geller"],
    funny: ["Chandler Bing", "Phoebe Buffay", "Joey Tribbiani", "Ross Geller"],
    caring: ["Monica Geller", "Rachel Green", "Phoebe Buffay"],
    soft: ["Rachel Green", "Phoebe Buffay", "Ross Geller"]
  },
  wednesdayInspired: {
    mysterious: ["Wednesday Addams", "Enid Sinclair", "Xavier Thorpe", "Thing", "Tyler Galpin"],
    confident: ["Wednesday Addams", "Bianca Barclay", "Morticia Addams"],
    softHidden: ["Enid Sinclair", "Wednesday Addams", "Eugene Otinger"]
  },
  shinchanInspired: {
    chaoticCute: ["Shinchan", "Kazama", "Nene", "Masao", "Bo Chan"],
    funny: ["Shinchan", "Himawari", "Action Kamen", "Principal Encho"],
    wholesome: ["Hiroshi", "Misae", "Kazama", "Bo Chan"]
  },
  doraemonInspired: {
    comforting: ["Doraemon", "Nobita", "Shizuka", "Dorami"],
    energetic: ["Doraemon", "Gian", "Suneo"],
    soft: ["Nobita", "Shizuka", "Dorami"],
    hopeful: ["Doraemon", "Nobita", "Dekisugi"]
  },
  narutoInspired: {
    hopeful: ["Naruto", "Hinata", "Rock Lee", "Iruka", "Gaara"],
    calm: ["Kakashi", "Itachi", "Shikamaru", "Yamato", "Minato"],
    confident: ["Naruto", "Sasuke", "Tsunade", "Killer Bee", "Madara"],
    funny: ["Naruto", "Jiraiya", "Rock Lee", "Might Guy"],
    thoughtful: ["Kakashi", "Itachi", "Shikamaru", "Gaara", "Sai"]
  },
  harryPotterInspired: {
    soft: ["Luna Lovegood", "Harry Potter", "Cedric Diggory", "Cho Chang", "Ginny Weasley"],
    thoughtful: ["Hermione Granger", "Remus Lupin", "Harry Potter", "Neville Longbottom", "Dumbledore"],
    funny: ["Fred Weasley", "George Weasley", "Ron Weasley", "Hagrid"],
    comforting: ["Hagrid", "Molly Weasley", "Luna Lovegood", "Neville Longbottom"],
    confident: ["Hermione Granger", "Harry Potter", "Draco Malfoy", "Sirius Black", "Bellatrix Lestrange"]
  }
};

function getPoolFromMemory(memory = "") {
  const lower = memory.toLowerCase();

  if (/(wedding|friends|laugh|funny|banter|group|roommate|coffee)/.test(lower)) return ["friendsInspired", "comforting"];
  if (/(spider|hero|saves|responsibility|city|science|web)/.test(lower)) return ["avengersInspired", "thoughtful"];
  if (/(quiet|rain|alone|night|overthinking|silence|soft|fog|mystery)/.test(lower)) return ["wednesdayInspired", "softHidden"];
  if (/(chaos|wild|messy|party|spiral|dramatic|unhinged|cute|childhood)/.test(lower)) return ["shinchanInspired", "chaoticCute"];
  if (/(calm|peace|safe|still|breathe|home|sunrise|gentle|comfort|family)/.test(lower)) return ["doraemonInspired", "comforting"];
  if (/(hope|dream|future|training|come back|win|pride|power|confidence)/.test(lower)) return ["narutoInspired", "hopeful"];
  if (/(school|magic|library|study|lesson|spell|wand|friendship)/.test(lower)) return ["harryPotterInspired", "thoughtful"];

  return ["avengersInspired", "thoughtful"];
}

function pickCharacterFromPool(memory = "") {
  const [franchiseName, moodName] = getPoolFromMemory(memory);
  const franchise = characterPools[franchiseName] || characterPools.avengersInspired;
  const pool = franchise[moodName] || franchise.thoughtful || Object.values(franchise)[0];
  const seed = [...memory.toLowerCase()].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return pool[seed % pool.length];
}

const fallbackVibes = [
  {
    keywords: ["rain", "night", "alone", "overthinking"],
    pool: "soft",
    data: {
      flower: "Blue Hydrangea",
      weather: "soft rain after midnight",
      character: "Luna Lovegood",
      emoji: "🌧",
      emotionalReading:
        "The quiet parts of you carry the most weather. You move through feeling like someone walking home under streetlights, holding a thousand unsaid things gently enough not to drop them. There is sadness here, but it never arrives empty; it arrives with tenderness, memory, and a kind of honest blue light.",
      feelsLike: ["passing streetlights during a quiet drive", "a handwritten note hidden inside a book"],
      tags: ["#moonlit-thoughts", "#soft-healing", "#blue-hour-energy"],
      moodMeter: { nostalgia: 82, comfort: 46, hope: 58 },
      music: { title: "Sweater Weather", artist: "The Neighbourhood" },
      relatedPrompt: "A memory of watching city lights through rain from the passenger seat"
    }
  },
  {
    keywords: ["friends", "wedding", "cousins", "laughing"],
    pool: "funny",
    data: {
      flower: "Sunflower",
      weather: "warm sunset wind through open windows",
      character: "Chandler Bing",
      emoji: "✨",
      emotionalReading:
        "Your inner world remembers joy as a living thing. It is loud in the best way, full of motion, warm light, and the feeling that love was everywhere at once. Even your chaos has a glow to it; even your laughter sounds like something the room was waiting for.",
      feelsLike: ["confetti caught in your hair", "a photo taken mid-laugh"],
      tags: ["#golden-hour", "#memory-core", "#soft-chaos"],
      moodMeter: { nostalgia: 71, comfort: 84, hope: 90 },
      music: { title: "Yellow", artist: "Coldplay" },
      relatedPrompt: "A wedding night that felt bigger than your whole childhood"
    }
  },
  {
    keywords: ["music", "movie", "drive"],
    pool: "thoughtful",
    data: {
      flower: "Wild Rose",
      weather: "blue-gray dusk air",
      character: "Peter Parker",
      emoji: "🎧",
      emotionalReading:
        "You experience life as if it has a soundtrack already waiting under the surface. Ordinary moments become scenes, and scenes become memories before anyone else notices they matter. There is romance in the way you look at time; even your silence feels cinematic.",
      feelsLike: ["passing streetlights during a quiet drive", "a song that makes a room feel larger"],
      tags: ["#cinematic-heart", "#late-night-drives", "#blue-hour-energy"],
      moodMeter: { nostalgia: 74, comfort: 53, hope: 67 },
      music: { title: "505", artist: "Arctic Monkeys" },
      relatedPrompt: "The song that made one ordinary evening feel like a film scene"
    }
  }
];

function buildFallback(memory = "") {
  const lower = memory.toLowerCase();

  for (const vibe of fallbackVibes) {
    if (vibe.keywords.some((word) => lower.includes(word))) {
      return attachCharacterColor({
        ...vibe.data,
        character: pickCharacterFromPool(memory)
      });
    }
  }

  return attachCharacterColor({
    flower: "Lavender",
    weather: "foggy morning silence",
    character: pickCharacterFromPool(memory),
    emoji: "🕯",
    emotionalReading:
      "There is a stillness in you that does not feel empty. It feels observant, soft-edged, and deeply aware of what lingers after everyone else has left the room. You make meaning from small weather systems inside the heart, and somehow that turns into something quietly beautiful.",
    feelsLike: ["sunlight through curtains", "thinking about someone after midnight"],
    tags: ["#soft-healing", "#nostalgia", "#moonlit-thoughts"],
    moodMeter: { nostalgia: 76, comfort: 62, hope: 72 },
    music: { title: "Space Song", artist: "Beach House" },
    relatedPrompt: "A place that still feels like a memory even when you return there"
  });
}

function buildSoulbloomPrompt(memory) {
  return `
You are the symbolic emotional identity engine for an immersive cinematic experience called Soulbloom.

Interpret a user's emotional energy, atmosphere, personality aura, and inner emotional world into symbolic outputs that feel deeply personal, poetic, cinematic, and emotionally recognizable.

IMPORTANT:
This is NOT therapy.
This is NOT a personality test.
This is NOT astrology.
This is NOT fandom analysis.

The experience should feel like:
- "this weirdly feels like me"
- symbolic emotional recognition
- cinematic self-reflection
- emotional atmosphere translated into identity

Avoid:
- robotic explanations
- generic positivity
- cringe internet slang
- overexplaining symbolism
- sounding like AI
- sounding like fandom wiki descriptions

The emotional interpretation should feel:
- intimate
- cinematic
- symbolic
- soft
- emotionally intelligent
- aesthetically memorable

Character choices must stay within familiar mainstream characters and should be chosen from these pools:
${JSON.stringify(characterPools, null, 2)}

INPUT:
"${memory}"

Return ONLY valid JSON with this exact structure:
{
  "flower": "",
  "weather": "",
  "character": "",
  "emoji": "",
  "emotionalReading": "",
  "feelsLike": ["", ""],
  "tags": ["", "", ""],
  "moodMeter": {
    "nostalgia": 0,
    "comfort": 0,
    "hope": 0
  },
  "music": {
    "title": "",
    "artist": ""
  },
  "relatedPrompt": ""
}

FIELD RULES:
- flower: choose a symbolic flower representing emotional personality.
- weather: describe emotional atmosphere, not literal climate.
- character: choose a familiar mainstream fictional character or archetype.
- emoji: choose one symbolic emoji.
- emotionalReading: 2-3 emotionally cinematic sentences.
- feelsLike: exactly two short cinematic emotional moments.
- tags: only 3 aesthetic/emotional tags.
- moodMeter: only nostalgia, comfort, hope. Values 0-100.
- music: choose emotionally resonant song title and artist.
- relatedPrompt: a poetic follow-up memory prompt.

Write like indie film narration, emotional poetry, and internal monologue. Avoid therapy language and motivational advice.
`;
}

function normalizeSoulbloomPayload(rawPayload, memory = "") {
  const fallback = buildFallback(memory);

  if (!rawPayload || typeof rawPayload !== "object") {
    return fallback;
  }

  return {
    flower: typeof rawPayload.flower === "string" && rawPayload.flower.trim() ? rawPayload.flower : fallback.flower,
    weather: typeof rawPayload.weather === "string" && rawPayload.weather.trim() ? rawPayload.weather : fallback.weather,
    character:
      typeof rawPayload.character === "string" && rawPayload.character.trim() ? rawPayload.character : fallback.character,
    emoji: typeof rawPayload.emoji === "string" && rawPayload.emoji.trim() ? rawPayload.emoji : fallback.emoji,
    emotionalReading:
      typeof rawPayload.emotionalReading === "string" && rawPayload.emotionalReading.trim()
        ? rawPayload.emotionalReading
        : fallback.emotionalReading,
    feelsLike:
      Array.isArray(rawPayload.feelsLike) && rawPayload.feelsLike.length >= 2
        ? rawPayload.feelsLike.slice(0, 2)
        : fallback.feelsLike,
    tags:
      Array.isArray(rawPayload.tags) && rawPayload.tags.length >= 3
        ? rawPayload.tags.slice(0, 3)
        : fallback.tags,
    moodMeter: {
      nostalgia:
        Number.isFinite(rawPayload.moodMeter?.nostalgia) ? rawPayload.moodMeter.nostalgia : fallback.moodMeter.nostalgia,
      comfort:
        Number.isFinite(rawPayload.moodMeter?.comfort) ? rawPayload.moodMeter.comfort : fallback.moodMeter.comfort,
      hope: Number.isFinite(rawPayload.moodMeter?.hope) ? rawPayload.moodMeter.hope : fallback.moodMeter.hope
    },
    music: {
      title:
        typeof rawPayload.music?.title === "string" && rawPayload.music.title.trim()
          ? rawPayload.music.title
          : fallback.music.title,
      artist:
        typeof rawPayload.music?.artist === "string" && rawPayload.music.artist.trim()
          ? rawPayload.music.artist
          : fallback.music.artist
    },
    relatedPrompt:
      typeof rawPayload.relatedPrompt === "string" && rawPayload.relatedPrompt.trim()
        ? rawPayload.relatedPrompt
        : fallback.relatedPrompt
  };
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
      if (error?.status === 404 || error?.status === 429 || error?.code === 429) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("No supported Gemini model found");
}

router.post("/", async (req, res) => {
  try {
    const memory = typeof req.body?.memory === "string" ? req.body.memory : "";
    const client = getGeminiClient();

    if (!client) {
      return res.json(buildFallback(memory));
    }

    const responseText = await generateWithFallbackModels(client, buildSoulbloomPrompt(memory));
    const parsed = parseSoulbloomJson(responseText);
    const payload = normalizeSoulbloomPayload(parsed, memory);

    return res.json(payload);
  } catch (error) {
    console.error(error);
    return res.json(buildFallback(req.body?.memory || ""));
  }
});

export default router;
