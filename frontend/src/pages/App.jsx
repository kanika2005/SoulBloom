
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Sparkles,
  Stars,
  WandSparkles
} from "lucide-react";
import VibeCard from "../components/VibeCard";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";

const starterPrompts = [
  "Watching rain while overthinking life.",
  "Late-night drives with old songs and one close friend.",
  "Laughing uncontrollably with cousins during weddings.",
  "Listening to music and pretending life is a movie.",
  "Missing someone but never texting them.",
  "A quiet train ride after an exam.",
  "The smell of perfume on winter clothes.",
  "A sunset that felt like closure."
];

function bloomKey(bloom) {
  return [bloom?.flower, bloom?.character, bloom?.emoji].filter(Boolean).join("::");
}

export default function App() {
  // Log API base so we can debug network issues in browser console
  console.log("Memory Bloom API base:", apiBase);
  const [memory, setMemory] = useState("");
  const [bloom, setBloom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("memory-bloom-favorites");

    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("memory-bloom-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = bloom ? favorites.some((item) => bloomKey(item) === bloomKey(bloom)) : false;

  const generateBloom = async () => {
    if (!memory.trim()) {
      setError("Write a memory first, then let it bloom.");
      setBloom(null);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${apiBase}/api/vibe`, {
        memory
      });

      setBloom(response.data);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.error || err?.message || "Could not bloom this memory right now.";
      setError(message);
      setBloom(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!bloom) return;

    setFavorites((current) => {
      const exists = current.some((item) => bloomKey(item) === bloomKey(bloom));

      if (exists) {
        return current.filter((item) => bloomKey(item) !== bloomKey(bloom));
      }

      return [bloom, ...current].slice(0, 12);
    });
  };

  const usePrompt = (prompt) => {
    setMemory(prompt);
    setError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bloom text-white">
      <div className="bloom-orb bloom-orb-one" />
      <div className="bloom-orb bloom-orb-two" />
      <div className="bloom-orb bloom-orb-three" />
      <div className="grain-overlay" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <img
                  src="/flower.png"
                  alt="Flower"
                />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.42em] text-white/45">Memory Bloom</p>
              <p className="text-sm text-white/70">Emotional symbolism for the internet-soft heart</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs text-white/70 backdrop-blur-xl sm:flex">
            <Bookmark className="h-3.5 w-3.5" />
            {favorites.length} saved blooms
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <section className="flex flex-col justify-between gap-5 pt-4 sm:pt-6 lg:pt-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.38em] text-white/60 backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5" />
                soulbloom emotional engine
              </div>

              <div className="max-w-xl space-y-4">
                <h1 className="font-display text-5xl leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">Soulbloom</h1>

                <p className="max-w-lg text-base leading-7 text-white/74 sm:text-lg">
                  Turn a private moment into a symbolic identity card that feels like a perfume ad, a poetry page, and a soft indie film still.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Flower", "symbolic identity"],
                  ["Weather", "emotional atmosphere"],
                  ["Mood Meter", "nostalgia / comfort / hope"]
                ].map(([title, subtitle]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.32em] text-white/45">{title}</p>
                    <p className="mt-2 text-sm text-white/72">{subtitle}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.26)] backdrop-blur-2xl sm:p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Enter a memory</p>
                  <p className="mt-2 max-w-md text-sm text-white/68">
                    The more specific the feeling, the more symbolic and personal the bloom becomes.
                  </p>
                </div>

                <div className="hidden rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/55 sm:block">
                  9:16 story-first layout
                </div>
              </div>

              <textarea
                value={memory}
                onChange={(event) => setMemory(event.target.value)}
                placeholder="Watching rain while overthinking life..."
                className="min-h-36 w-full resize-none rounded-[1.5rem] border border-white/10 bg-[#0d1122]/60 px-4 py-4 text-[15px] leading-7 text-white outline-none placeholder:text-white/30 focus:border-white/18 focus:bg-[#0f1328]/80"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => usePrompt(prompt)}
                    className="rounded-full border border-white/10 bg-white/8 px-3.5 py-2 text-left text-[13px] text-white/70 transition hover:border-white/20 hover:bg-white/12"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={generateBloom}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f8c6d8] via-[#cfb4ff] to-[#8fd6ff] px-5 py-4 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(180,150,255,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Stars className="h-4 w-4 animate-pulse" />
                      Reading your aura...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="h-4 w-4" />
                      Generate Soulbloom
                    </>
                  )}
                </button>

                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-xs text-white/58 backdrop-blur-xl sm:w-44">
                  Emotional output only. No chatbot tone.
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </p>
              )}
            </motion.section>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Shareable</p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Built for story screenshots, quiet emotional flexing, and save-worthy moments.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Favorite blooms</p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Saved memories live locally, so your emotional archive stays private and close.
                </p>
              </div>
            </div>
          </section>

          <section className="pb-10 pt-2 lg:pt-10">
            <VibeCard
              ref={cardRef}
              bloom={bloom}
              loading={loading}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onUsePrompt={usePrompt}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
