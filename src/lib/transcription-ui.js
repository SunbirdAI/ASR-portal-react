import { ASR_LANGUAGE_OPTIONS } from "./asr-languages";

export const ASR_PICKER_OPTIONS = ASR_LANGUAGE_OPTIONS;

export const getLanguageLabel = (languageCode) =>
  ASR_PICKER_OPTIONS.find((language) => language.value === languageCode)
    ?.label || "Not specified";

export const formatDuration = (seconds = 0) => {
  const normalizedSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(normalizedSeconds / 60);
  const remainingSeconds = normalizedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export const createTranscriptSegments = (text = "") => {
  const normalizedText = text.trim();

  if (!normalizedText) return [];

  const sentenceChunks = normalizedText
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]?/g);

  const chunks =
    sentenceChunks && sentenceChunks.length > 0 ? sentenceChunks : [normalizedText];

  return chunks
    .map((chunk, index) => ({
      id: `${index}-${chunk.slice(0, 12)}`,
      timestamp: formatDuration(index * 8),
      text: chunk.trim(),
    }))
    .filter((segment) => segment.text);
};

export const createSegmentsFromTranscription = (result) => {
  if (Array.isArray(result?.segments) && result.segments.length > 0) {
    return result.segments.map((segment, index) => ({
      id: `segment-${index}-${segment.start ?? index}`,
      timestamp: formatDuration(segment.start || index * 8),
      endTimestamp: formatDuration(segment.end || index * 8 + 8),
      speaker: segment.speaker || null,
      text: segment.text?.trim() || "",
    })).filter((segment) => segment.text);
  }

  if (
    result?.diarization_output &&
    typeof result.diarization_output === "object" &&
    Object.keys(result.diarization_output).length > 0
  ) {
    return Object.entries(result.diarization_output)
      .map(([speaker, value], index) => ({
        id: `speaker-${speaker}-${index}`,
        timestamp: formatDuration(index * 8),
        speaker,
        text: Array.isArray(value) ? value.join(" ") : String(value || ""),
      }))
      .filter((segment) => segment.text);
  }

  return createTranscriptSegments(result?.audio_transcription || result || "");
};

export const createPlainTranscript = (segments = []) =>
  segments.map((segment) => `[${segment.timestamp}] ${segment.text}`).join("\n\n");

export const createSrtTranscript = (segments = []) =>
  segments
    .map((segment, index) => {
      const start = index * 8;
      const end = start + 8;
      return `${index + 1}\n00:${formatDuration(start)},000 --> 00:${formatDuration(
        end
      )},000\n${segment.text}`;
    })
    .join("\n\n");

export const downloadTextFile = (filename, contents) => {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const waveformBars = [
  28, 42, 64, 38, 76, 52, 84, 46, 68, 36, 72, 58, 88, 44, 66, 50, 78, 34, 62,
  82, 48, 70, 40, 56, 74, 32, 60, 86, 52, 68, 38, 80,
];
