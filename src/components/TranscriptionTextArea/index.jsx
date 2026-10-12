import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Check,
  Download,
  Edit3,
  Search,
  Play,
  FileText,
  Subtitles,
  Code,
  X,
  Save,
  RotateCcw,
} from "lucide-react";
import LinearProgress from "@mui/material/LinearProgress";

/** Format seconds → MM:SS */
const fmtTime = (s) => {
  if (isNaN(s) || s === null) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${String(m).padStart(2, "0")}:${sec}`;
};

/** Format seconds → HH:MM:SS,mmm for SRT */
const formatSrtTime = (seconds) => {
  const s = Math.max(0, seconds || 0);
  const hours = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  const millis = Math.floor((s % 1) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
};

/** Format seconds → HH:MM:SS.mmm for VTT */
const formatVttTime = (seconds) => {
  const s = Math.max(0, seconds || 0);
  const hours = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  const millis = Math.floor((s % 1) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
};

const TranscriptionTextArea = ({
  placeholder = "Your transcript will appear here...",
  text = "",
  setText,
  isLoading = false,
  timestamps = null,
  setTimestamps = null,
  currentAudioTime = 0,
  onSeekAudio,
  fileName = "",
  language = "lug",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedSegments, setEditedSegments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Single segment quick-edit tracking
  const [activeInlineEditIndex, setActiveInlineEditIndex] = useState(null);
  const [inlineSegmentText, setInlineSegmentText] = useState("");

  const hasSegments = Array.isArray(timestamps) && timestamps.length > 0;

  // Active segment detection based on live audio player playback position
  const activeSegmentIndex = useMemo(() => {
    if (!hasSegments || currentAudioTime === null) return -1;
    return timestamps.findIndex(
      (seg) => currentAudioTime >= seg.start && currentAudioTime <= seg.end
    );
  }, [hasSegments, timestamps, currentAudioTime]);

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const activeSegmentRef = useRef(null);

  // Auto-scroll active speaking segment into view as audio plays
  useEffect(() => {
    if (!isEditing && activeSegmentIndex >= 0 && activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [activeSegmentIndex, isEditing]);

  // When new text / transcript arrives, ensure top of transcript is in view
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (text && containerRef.current) {
      const timer = setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [text]);

  const handleStartEdit = () => {
    if (hasSegments) {
      setEditedSegments(timestamps.map((seg) => ({ ...seg })));
    } else {
      setEditedText(text);
    }
    setIsEditing(true);
  };

  const handleSegmentChange = (index, newText) => {
    setEditedSegments((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text: newText };
      return copy;
    });
  };

  const handleSaveEdit = () => {
    if (hasSegments) {
      if (setTimestamps) {
        setTimestamps(editedSegments);
      }
      const combined = editedSegments.map((s) => s.text.trim()).join(" ");
      if (setText) setText(combined);
    } else {
      if (setText) setText(editedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedSegments([]);
  };

  // Quick single-segment inline edit handlers
  const handleStartInlineEdit = (index, currentText, e) => {
    e.stopPropagation();
    setActiveInlineEditIndex(index);
    setInlineSegmentText(currentText);
  };

  const handleSaveInlineEdit = (index, e) => {
    e.stopPropagation();
    const updated = timestamps.map((s, i) =>
      i === index ? { ...s, text: inlineSegmentText } : s
    );
    if (setTimestamps) setTimestamps(updated);
    const combined = updated.map((s) => s.text.trim()).join(" ");
    if (setText) setText(combined);
    setActiveInlineEditIndex(null);
  };

  const handleCancelInlineEdit = (e) => {
    e.stopPropagation();
    setActiveInlineEditIndex(null);
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const downloadBlob = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const baseFileName = fileName
    ? fileName.replace(/\.[^.]+$/, "")
    : `sunbird_transcript_${Date.now()}`;

  const exportAsTxt = () => {
    const header = [
      "==================================================",
      "  Transcribed by Sunbird AI  |  speech.sunbird.ai",
      `  File: ${fileName || "audio"}`,
      `  Language: ${language}`,
      `  Exported: ${new Date().toISOString()}`,
      "==================================================",
      "",
    ].join("\n");

    let body = "";
    if (hasSegments) {
      body = timestamps
        .map(
          (seg) =>
            `[${fmtTime(seg.start)} --> ${fmtTime(seg.end)}]  ${seg.text.trim()}`
        )
        .join("\n\n");
    } else {
      body = text;
    }

    const fullContent = `${header}\n${body}\n\n==================================================\n`;
    downloadBlob(fullContent, `${baseFileName}.txt`, "text/plain;charset=utf-8");
  };

  const exportAsSrt = () => {
    let srt = "";
    if (hasSegments) {
      srt = timestamps
        .map((seg, i) => {
          return `${i + 1}\n${formatSrtTime(seg.start)} --> ${formatSrtTime(seg.end)}\n${seg.text.trim()}\n`;
        })
        .join("\n");
    } else {
      srt = `1\n00:00:00,000 --> 00:00:30,000\n${text}\n`;
    }
    downloadBlob(srt, `${baseFileName}.srt`, "application/x-subrip;charset=utf-8");
  };

  const exportAsVtt = () => {
    let vtt = "WEBVTT - Transcribed by Sunbird AI\n\n";
    if (hasSegments) {
      vtt += timestamps
        .map((seg, i) => {
          return `${i + 1}\n${formatVttTime(seg.start)} --> ${formatVttTime(seg.end)}\n${seg.text.trim()}\n`;
        })
        .join("\n");
    } else {
      vtt += `1\n00:00:00.000 --> 00:00:30.000\n${text}\n`;
    }
    downloadBlob(vtt, `${baseFileName}.vtt`, "text/vtt;charset=utf-8");
  };

  const exportAsJson = () => {
    const data = {
      generator: "Sunbird AI Speech Studio",
      audio_file: fileName || null,
      language: language,
      timestamp: new Date().toISOString(),
      full_transcript: text,
      segments: hasSegments ? timestamps : null,
    };
    downloadBlob(
      JSON.stringify(data, null, 2),
      `${baseFileName}.json`,
      "application/json;charset=utf-8"
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border flex flex-col overflow-hidden transition-all scroll-mt-6"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--color-elev-soft)",
      }}
    >
      {/* Top Action Toolbar */}
      <div
        className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2"
        style={{
          background: "var(--color-pill)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              background: "var(--color-surface)",
            }}
          >
            {hasSegments ? `${timestamps.length} Timestamped Segments` : "Transcript"}
          </span>

          {hasSegments && (
            <span
              className="text-xs hidden sm:inline"
              style={{ color: "var(--color-muted)" }}
            >
              {isEditing
                ? "Editing segments by timestamp"
                : "Click timestamp to seek audio"}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 relative">
          {/* Search within transcript (only in view mode) */}
          {hasSegments && !isEditing && (
            <div className="relative hidden md:flex items-center">
              <Search
                size={13}
                className="absolute left-2.5 pointer-events-none"
                style={{ color: "var(--color-muted)" }}
              />
              <input
                type="text"
                placeholder="Filter words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-6 py-1 rounded-lg text-xs border outline-none transition-all w-28 focus:w-44"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Edit / Save Button */}
          {text && (
            <>
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
                    style={{
                      borderColor: "var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-muted)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-all hover:opacity-90"
                    style={{ background: "var(--color-accent)" }}
                  >
                    <Save size={13} />
                    <span>Save Segments</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                  title="Edit segments according to timestamps"
                >
                  <Edit3 size={13} />
                  <span>Edit by Timestamps</span>
                </button>
              )}
            </>
          )}

          {/* Copy Button */}
          {text && !isEditing && (
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
              }}
              title="Copy all transcript text"
            >
              {copied ? (
                <>
                  <Check size={13} style={{ color: "var(--color-accent)" }} />
                  <span style={{ color: "var(--color-accent)" }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {/* Export Dropdown */}
          {text && !isEditing && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportMenuOpen((prev) => !prev)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                style={{
                  background: "var(--color-accent)",
                  color: "#ffffff",
                }}
                title="Export transcript in various formats"
              >
                <Download size={13} />
                <span>Export</span>
              </button>

              {exportMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 rounded-xl border shadow-lg py-1.5 z-30 flex flex-col"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={exportAsTxt}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:opacity-80 transition-colors"
                    style={{ color: "var(--color-text)" }}
                  >
                    <FileText size={14} style={{ color: "var(--color-accent)" }} />
                    <span>Plain Text (.txt)</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportAsSrt}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:opacity-80 transition-colors"
                    style={{ color: "var(--color-text)" }}
                  >
                    <Subtitles size={14} style={{ color: "var(--color-accent)" }} />
                    <span>Subtitles (.srt)</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportAsVtt}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:opacity-80 transition-colors"
                    style={{ color: "var(--color-text)" }}
                  >
                    <Subtitles size={14} style={{ color: "var(--color-accent)" }} />
                    <span>Web Video (.vtt)</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportAsJson}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:opacity-80 transition-colors"
                    style={{ color: "var(--color-text)" }}
                  >
                    <Code size={14} style={{ color: "var(--color-accent)" }} />
                    <span>Structured JSON (.json)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <LinearProgress
          color="inherit"
          sx={{
            height: 3,
            backgroundColor: "var(--color-pill)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "var(--color-accent)",
            },
          }}
        />
      )}

      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        className="p-4 sm:p-5 min-h-[220px] max-h-[500px] overflow-y-auto"
      >
        {/* MODE A: FULL TIMESTAMPED SEGMENT EDITING MODE */}
        {isEditing && hasSegments ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs m-0 mb-1" style={{ color: "var(--color-muted)" }}>
              Edit each audio section next to its timestamp. Click the play button to hear that segment.
            </p>
            {editedSegments.map((seg, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-start gap-2.5 transition-all"
                style={{
                  background: "var(--color-pill)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Timestamp Pill & Listen Button */}
                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => onSeekAudio && onSeekAudio(seg.start)}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wide flex items-center gap-1 border transition-colors hover:opacity-90"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-accent)",
                    }}
                    title={`Listen from ${fmtTime(seg.start)}`}
                  >
                    <Play size={10} fill="currentColor" />
                    <span>
                      {fmtTime(seg.start)} › {fmtTime(seg.end)}
                    </span>
                  </button>
                </div>

                {/* Editable Segment Textarea */}
                <textarea
                  rows={2}
                  value={seg.text}
                  onChange={(e) => handleSegmentChange(idx, e.target.value)}
                  className="flex-1 p-2.5 rounded-lg border text-sm leading-relaxed outline-none transition-all resize-y focus:ring-2 focus:ring-amber-500/20"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                  placeholder={`Segment ${idx + 1} transcript...`}
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                Discard Edits
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
                style={{ background: "var(--color-accent)" }}
              >
                <Save size={13} />
                <span>Save All Segments</span>
              </button>
            </div>
          </div>
        ) : isEditing && !hasSegments ? (
          /* Plain text editing fallback when no timestamps exist */
          <div className="flex flex-col gap-3">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={8}
              className="w-full p-3 rounded-xl border text-sm font-normal leading-relaxed outline-none focus:ring-2 focus:ring-amber-500/20"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              placeholder="Edit your transcript here..."
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: "var(--color-accent)" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : hasSegments ? (
          /* MODE B: VIEWING TIMESTAMPED SEGMENTS WITH INLINE EDIT & SEEK */
          <div className="flex flex-col gap-2.5">
            {timestamps
              .filter((seg) =>
                searchQuery
                  ? seg.text.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((seg, i) => {
                const isActive = activeSegmentIndex === i;
                const isInlineEditing = activeInlineEditIndex === i;

                return (
                  <div
                    key={i}
                    onClick={() => !isInlineEditing && onSeekAudio && onSeekAudio(seg.start)}
                    role="button"
                    tabIndex={0}
                    className={`group p-2.5 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 border ${
                      isActive
                        ? "shadow-sm"
                        : "hover:bg-[var(--color-pill)] border-transparent"
                    }`}
                    style={{
                      background: isActive
                        ? "var(--color-accent-soft)"
                        : "transparent",
                      borderColor: isActive
                        ? "var(--color-accent)"
                        : "transparent",
                    }}
                  >
                    {/* Timestamp Pill */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSeekAudio) onSeekAudio(seg.start);
                        }}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold tracking-wide flex items-center gap-1 transition-transform group-hover:scale-105"
                        style={{
                          background: isActive
                            ? "var(--color-accent)"
                            : "var(--color-pill)",
                          color: isActive ? "#ffffff" : "var(--color-muted)",
                          border: "1px solid var(--color-border)",
                        }}
                        title={`Jump to ${fmtTime(seg.start)}`}
                      >
                        <Play size={9} fill="currentColor" />
                        <span>
                          {fmtTime(seg.start)} › {fmtTime(seg.end)}
                        </span>
                      </button>
                    </div>

                    {/* Segment Text or Inline Editor */}
                    <div className="flex-1 flex items-start justify-between gap-2">
                      {isInlineEditing ? (
                        <div
                          className="flex-1 flex flex-col gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <textarea
                            rows={2}
                            value={inlineSegmentText}
                            onChange={(e) => setInlineSegmentText(e.target.value)}
                            className="w-full p-2 rounded-lg border text-sm leading-relaxed outline-none focus:ring-2 focus:ring-amber-500/20"
                            style={{
                              background: "var(--color-surface)",
                              borderColor: "var(--color-border)",
                              color: "var(--color-text)",
                            }}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={handleCancelInlineEdit}
                              className="px-2 py-1 rounded text-[11px] border"
                              style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-muted)",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleSaveInlineEdit(i, e)}
                              className="px-2.5 py-1 rounded text-[11px] font-semibold text-white"
                              style={{ background: "var(--color-accent)" }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          className="text-sm m-0 leading-relaxed font-normal flex-1"
                          style={{
                            color: "var(--color-text)",
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {seg.text.trim()}
                        </p>
                      )}

                      {/* Quick pencil button on hover to edit this single segment */}
                      {!isInlineEditing && (
                        <button
                          type="button"
                          onClick={(e) => handleStartInlineEdit(i, seg.text, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity hover:scale-110"
                          style={{ color: "var(--color-muted)" }}
                          title="Edit this segment"
                          aria-label="Edit segment"
                        >
                          <Edit3 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center py-8">
            {text ? (
              <p
                className="text-sm sm:text-base leading-relaxed m-0 text-left whitespace-pre-wrap"
                style={{ color: "var(--color-text)" }}
              >
                {text}
              </p>
            ) : (
              <p
                className="text-sm m-0"
                style={{ color: "var(--color-muted)" }}
              >
                {placeholder}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionTextArea;
