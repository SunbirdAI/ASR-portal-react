import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

/** Format seconds to MM:SS */
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];
// 110 bars provides tight, dense packing across wide containers (no wide empty gaps)
const NUM_BARS = 110;

/**
 * Natural voice rhythm envelope with crisp amplitude dynamics and tight cadence.
 */
const generateSpeechEnvelope = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Multi-cadence natural speech waveform envelope with realistic syllable bursts
    const phrase = Math.sin(t * Math.PI * 4.2);
    const syllable =
      Math.sin(i * 0.72) * 0.32 +
      Math.cos(i * 1.45) * 0.22 +
      Math.sin(i * 2.8) * 0.12;
    const raw = Math.abs(phrase) * 0.52 + syllable + 0.32;
    const height = Math.min(Math.max(raw * 96, 14), 98);
    result.push(Math.round(height));
  }
  return result;
};

const AudioPlayer = ({
  audioSrc,
  onTimeUpdate,
  seekTime = null,
  fileName = "",
}) => {
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverPercent, setHoverPercent] = useState(null);
  const [peaks, setPeaks] = useState(() => generateSpeechEnvelope(NUM_BARS));

  // Extract true normalized audio peaks from the audio buffer
  useEffect(() => {
    let isCancelled = false;
    if (!audioSrc) return;

    const extractAudioPeaks = async () => {
      try {
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) throw new Error("No AudioContext");

        const audioCtx = new AudioCtx();
        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        if (isCancelled) return;

        if (decodedBuffer.duration && isFinite(decodedBuffer.duration)) {
          setDuration((prev) => (prev > 0 ? prev : decodedBuffer.duration));
        }

        const channelData = decodedBuffer.getChannelData(0);
        const step = Math.floor(channelData.length / NUM_BARS);
        const rawPeaks = [];

        for (let i = 0; i < NUM_BARS; i++) {
          let maxVal = 0;
          const start = i * step;
          const end = Math.min(start + step, channelData.length);
          for (let j = start; j < end; j += 4) {
            const val = Math.abs(channelData[j] || 0);
            if (val > maxVal) maxVal = val;
          }
          rawPeaks.push(maxVal);
        }

        const globalMax = Math.max(...rawPeaks, 0.04);
        const normalized = rawPeaks.map((peak) => {
          const ratio = Math.pow(peak / globalMax, 0.65);
          return Math.round(Math.min(Math.max(ratio * 95, 14), 100));
        });

        if (!isCancelled && normalized.length === NUM_BARS) {
          setPeaks(normalized);
        }
      } catch {
        if (!isCancelled) {
          setPeaks(generateSpeechEnvelope(NUM_BARS));
        }
      }
    };

    extractAudioPeaks();
    return () => {
      isCancelled = true;
    };
  }, [audioSrc]);

  // Smooth 60fps playhead animation loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    let animId;

    const tick = () => {
      if (audioRef.current) {
        const curr = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setCurrentTime(curr);

        if (dur && isFinite(dur) && dur > 0) {
          setDuration(dur);
        }

        if (onTimeUpdate) {
          onTimeUpdate(curr);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, onTimeUpdate]);

  // External seek requests
  useEffect(() => {
    if (seekTime !== null && audioRef.current && isFinite(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [seekTime]);

  // Reset state when audio source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.error("Playback error:", e);
        });
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const d = audioRef.current.duration;
    if (d && isFinite(d) && d > 0) {
      setDuration(d);
    }
  };

  const seekToPercent = (pct) => {
    if (!audioRef.current) return;
    const total = duration > 0 ? duration : audioRef.current.duration || 0;
    if (!total || !isFinite(total)) return;
    const newTime = Math.min(Math.max(pct * total, 0), total);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (onTimeUpdate) onTimeUpdate(newTime);
  };

  const handleWaveformClick = (e) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.min(Math.max(clickX / rect.width, 0), 1);
    seekToPercent(pct);
  };

  const handleWaveformMouseMove = (e) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const pct = Math.min(Math.max(moveX / rect.width, 0), 1);
    setHoverPercent(pct);
  };

  const skipSeconds = (secs) => {
    if (!audioRef.current) return;
    const total = duration > 0 ? duration : audioRef.current.duration || 1000;
    const newTime = Math.min(
      Math.max(audioRef.current.currentTime + secs, 0),
      total
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (onTimeUpdate) onTimeUpdate(newTime);
  };

  const cycleSpeed = () => {
    const nextIndex = (SPEEDS.indexOf(speed) + 1) % SPEEDS.length;
    const nextSpeed = SPEEDS[nextIndex];
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const effectiveDuration =
    duration > 0
      ? duration
      : audioRef.current?.duration && isFinite(audioRef.current.duration)
      ? audioRef.current.duration
      : 0;

  const progressRatio =
    effectiveDuration > 0
      ? Math.min(Math.max(currentTime / effectiveDuration, 0), 1)
      : 0;

  const progressPercent = progressRatio * 100;

  if (!audioSrc) return null;

  return (
    <div
      className="w-full transition-all duration-200"
      style={{
        background: "transparent",
      }}
      role="region"
      aria-label="Audio player with waveform visualizer"
    >
      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onCanPlay={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Top Track Metadata (Slim Header) */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2 truncate max-w-[65%]">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isPlaying ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: isPlaying
                ? "var(--color-accent)"
                : "var(--color-muted)",
            }}
          />
          <span
            className="font-medium truncate text-xs"
            style={{ color: "var(--color-text)" }}
            title={fileName || "Audio Track"}
          >
            {fileName || "Audio Recording"}
          </span>
        </div>

        <div
          className="font-mono text-[11px] font-semibold tabular-nums tracking-wide"
          style={{ color: "var(--color-muted)" }}
        >
          {formatTime(currentTime)} / {formatTime(effectiveDuration)}
        </div>
      </div>

      {/* ── Pure Soundwaves (No Box / Border / Background) ── */}
      <div className="relative mb-2.5 group select-none">
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          onMouseMove={handleWaveformMouseMove}
          onMouseLeave={() => setHoverPercent(null)}
          className="w-full h-11 sm:h-12 flex items-center gap-[1.5px] sm:gap-[2px] py-1 cursor-pointer relative overflow-hidden transition-all"
          style={{
            background: "transparent",
          }}
          title="Click to seek"
        >
          {/* Dense Amplitude Wave Bars (No gaps or justify-between spacing) */}
          {peaks.map((heightPct, idx) => {
            const barRatio = idx / peaks.length;
            const isPlayed = barRatio <= progressRatio;
            const isHovered =
              hoverPercent !== null && barRatio <= hoverPercent;

            return (
              <div
                key={idx}
                className="flex-1 rounded-full transition-all duration-75"
                style={{
                  height: `${heightPct}%`,
                  minHeight: "3px",
                  maxHeight: "100%",
                  backgroundColor: isPlayed
                    ? "var(--color-accent)"
                    : isHovered
                    ? "rgba(217, 119, 6, 0.4)"
                    : "var(--color-border)",
                  opacity: isPlayed ? 1 : 0.65,
                }}
              />
            );
          })}

          {/* Continuous Smooth 60fps Playhead Pin */}
          <div
            className="absolute top-0 bottom-0 w-[2px] pointer-events-none transition-none"
            style={{
              left: `${progressPercent}%`,
              background: "var(--color-accent)",
              boxShadow: "0 0 6px var(--color-accent)",
            }}
          />

          {/* Floating Hover Tooltip */}
          {hoverPercent !== null && effectiveDuration > 0 && (
            <div
              className="absolute top-0.5 pointer-events-none px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-sm border -translate-x-1/2 z-10"
              style={{
                left: `${hoverPercent * 100}%`,
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-accent)",
              }}
            >
              {formatTime(hoverPercent * effectiveDuration)}
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls Row (Sleek Compact Bar) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Rewind -5s */}
          <button
            type="button"
            onClick={() => skipSeconds(-5)}
            className="p-1.5 rounded-lg transition-colors hover:opacity-80 active:scale-95 border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
              background: "var(--color-pill)",
            }}
            title="Rewind 5s"
          >
            <RotateCcw size={14} />
          </button>

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#ffffff",
            }}
            title={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <>
                <Pause size={14} fill="currentColor" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>

          {/* Forward +5s */}
          <button
            type="button"
            onClick={() => skipSeconds(5)}
            className="p-1.5 rounded-lg transition-colors hover:opacity-80 active:scale-95 border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
              background: "var(--color-pill)",
            }}
            title="Forward 5s"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Speed & Volume Right Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={cycleSpeed}
            className="px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors hover:opacity-80 border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              background: "var(--color-pill)",
            }}
            title="Change speed"
          >
            {speed}x
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg transition-colors hover:opacity-80 border"
            style={{
              borderColor: "var(--color-border)",
              color: isMuted ? "var(--color-accent)" : "var(--color-muted)",
              background: "var(--color-pill)",
            }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
