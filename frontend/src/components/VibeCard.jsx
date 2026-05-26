
import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Share2,
  Sparkles,
  Youtube,
  Music4,
  Flower2,
  CloudSun,
  User,
  Smile,
  Heart
} from "lucide-react";

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

const moodLabels = [
  ["nostalgia", "Nostalgia"],
  ["comfort", "Comfort"],
  ["hope", "Hope"]
];

const symbolItems = [
  ["Flower", "flower", Flower2],
  ["Weather", "weather", CloudSun],
  ["Character", "character", User],
  ["Emoji", "emoji", Smile]
];

const VibeCard = forwardRef(function VibeCard(
  { bloom, loading, isFavorite, onToggleFavorite, onUsePrompt },
  ref
) {
  const cardRef = useRef(null);

  useImperativeHandle(ref, () => ({
    cardRef: cardRef.current,
    async shareBloom() {
      if (!cardRef.current) return;

      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

      if (!blob) return;
        const text = `${bloom.flower} · ${bloom.character}\n${bloom.emotionalReading}\n#Soulbloom`;
      const fileName = `${(bloom?.title || "memory-bloom").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: bloom?.title || "Memory Bloom",
            text: bloom?.description || "A memory bloom",
            files: [file]
          });
          return;
        } catch {
          // fall through to download
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  }));

  const shareImage = async () => {
    if (!cardRef.current) return;

    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

    if (!blob) return;

    const fileName = `${(bloom?.title || "memory-bloom").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    const file = new File([blob], fileName, { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: bloom?.title || "Memory Bloom",
          text: bloom?.description || "A memory bloom",
          files: [file]
        });
        return;
      } catch {
        // fall through to download
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyShareText = async () => {
    if (!bloom) return;

    const text = `${bloom.title} - ${bloom.subtitle}\n${bloom.description}\n#MemoryBloom`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy this Memory Bloom text", text);
    }
  };

  const musicSearch = bloom?.music?.spotifySearch || "#";
  const youtubeSearch = bloom?.music?.youtubeSearch || "#";

  if (!bloom) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_40px_140px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
      >
        <div className="bloom-card-shell">
          <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-[#0c1020]/55 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.34em] text-white/40">Awaiting a memory</p>
                <h2 className="font-display text-4xl leading-none text-white/90">A Soulbloom will appear here</h2>
              </div>

              <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white/55">
                story card
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-white/58">
              Share a memory and Soulbloom will transform it into a cinematic identity card with symbolic emotional details.
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Flower", "Weather", "Character", "Emoji"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-xs uppercase tracking-[0.3em] text-white/45">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 shadow-[0_40px_140px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
      style={{
        backgroundImage: `linear-gradient(145deg, ${bloom.palette?.[0] || "#24193c"}cc, ${bloom.palette?.[1] || "#0f1531"}d9 42%, ${bloom.palette?.[2] || "#180f2e"}ef)`
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="absolute inset-0 bloom-card-noise" />

      <div className="relative space-y-5 p-4 sm:p-5">
        <div className="rounded-[1.75rem] border border-white/12 bg-[#060814]/55 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.38em] text-white/52">soulbloom</p>
              <h2 className="font-display text-4xl leading-[0.92] text-white sm:text-5xl">{bloom.character}</h2>
              <p className="max-w-md text-sm leading-7 text-white/78 sm:text-[15px]">{bloom.flower}</p>
            </div>

            <button
              type="button"
              onClick={onToggleFavorite}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-white transition hover:border-white/25 hover:bg-white/12"
              aria-label={isFavorite ? "Unsave bloom" : "Save bloom"}
            >
              {isFavorite ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {symbolItems.map(([label, key, Icon]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/42">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/84">{bloom[key]}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.34em] text-white/45">
              <Sparkles className="h-3.5 w-3.5" /> emotional reading
            </div>
            <p className="mt-3 text-[15px] leading-7 text-white/86">{bloom.emotionalReading}</p>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.34em] text-white/45">Emoji</p>
            <p className="mt-3 text-4xl leading-none text-white/90">{bloom.emoji}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.34em] text-white/45">Feels like</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(bloom.feelsLike || []).map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/74">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(bloom.tags || []).map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-xs text-white/72">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {(bloom.palette || []).map((color) => (
              <div key={color} className="h-10 rounded-full border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]" style={{ background: color }} />
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/12 bg-[#070a16]/55 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-white/45">Mood meter</p>
              <p className="mt-2 text-sm text-white/68">Symbolic intensity expressed as feeling, not data.</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
              mood intensity
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {moodLabels.map(([key, label]) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-xs text-white/65">
                  <span>{label}</span>
                  <span>{clamp(bloom.moodMeter?.[key])}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clamp(bloom.moodMeter?.[key])}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#ffd5e7] via-[#d0b7ff] to-[#7fd7ff]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] border border-white/12 bg-[#070a16]/55 p-4 sm:p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-white/45">Music match</p>
            <div className="mt-3 rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
              <p className="text-base font-medium text-white">{bloom.music?.title}</p>
              <p className="mt-1 text-sm text-white/68">{bloom.music?.artist}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={musicSearch}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/75 transition hover:bg-white/15"
                >
                  <Music4 className="h-3.5 w-3.5" />
                  Spotify search
                </a>

                <a
                  href={youtubeSearch}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/75 transition hover:bg-white/15"
                >
                  <Youtube className="h-3.5 w-3.5" />
                  YouTube search
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-white/45">Related prompt</p>
            <p className="mt-3 rounded-[1.5rem] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-white/76">
              {bloom.relatedPrompt}
            </p>

            <button
              type="button"
              onClick={() => onUsePrompt?.(bloom.relatedPrompt)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white/78 transition hover:bg-white/15"
            >
              Try this memory <Copy className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={shareImage}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              <Share2 className="h-4 w-4" />
              Share as image
            </button>

            <button
              type="button"
              onClick={copyShareText}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              <Copy className="h-4 w-4" />
              Copy caption
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/12 bg-white/8 px-4 py-3 text-[12px] leading-6 text-white/55">
          {loading ? "The identity is still forming..." : "Designed to feel like an indie film still, a poetry page, and a screenshot-worthy identity card."}
        </div>
      </div>
    </motion.article>
  );
});

export default VibeCard;
