/**
 * Simple, zero-dependency internationalization dictionary for Speech Studio.
 * Supports English (default) and Luganda, with easy extension for Acholi, Swahili, etc.
 */

export const TRANSLATIONS = {
  en: {
    appTitle: "Sunbird AI Speech Studio",
    tagline: "High-accuracy African language speech technology",
    sttTab: "Speech to Text",
    sttDesc: "Transcribe spoken African languages into accurate text with timestamps.",
    ttsTab: "Text to Speech",
    ttsDesc: "Generate expressive, natural speech audio from text across African languages.",
    uploadAudio: "Upload audio",
    dragAudioHint: "Drag and drop your audio file here, or click to browse",
    dragSupportedHint: "Supports MP3, WAV, M4A, OGG, FLAC (max 15MB, up to 15 min)",
    recordAudio: "Record with microphone",
    recordingLive: "Recording in progress...",
    startRecord: "Record",
    stopRecord: "Stop recording",
    trySample: "Try a sample audio",
    sampleLuganda: "Sample: Luganda News Clip",
    sourceLanguage: "Source language",
    searchLanguage: "Search language or code...",
    transcribeBtn: "Transcribe Audio",
    transcribing: "Transcribing...",
    transcribeAgain: "Transcribe Again",
    reset: "Clear / Reset",
    transcriptReady: "Transcript Ready",
    awaitingAudio: "Awaiting audio input",
    audioReady: "Audio loaded and ready",
    copy: "Copy Text",
    copied: "Copied to clipboard!",
    download: "Export Transcript",
    formatTxt: "Text (.txt) with watermark",
    formatSrt: "Subtitles (.srt)",
    formatVtt: "Web Video (.vtt)",
    formatJson: "Structured (.json)",
    editTranscript: "Edit Transcript",
    saveChanges: "Save Changes",
    discardChanges: "Cancel",
    searchInTranscript: "Search in transcript...",
    enterText: "Enter or paste your text here...",
    characterLimit: "Characters",
    generateSpeech: "Generate Speech",
    generating: "Synthesizing voice...",
    selectVoice: "Select Voice",
    autoVoice: "Default Voice (Auto)",
    downloadAudio: "Download Audio",
    recentJobs: "Recent Studio Sessions",
    noRecentJobs: "No recent sessions yet. Transcribe or generate speech to see history here.",
    reopen: "Reopen",
    speed: "Speed",
    feedbackTitle: "Rate accuracy",
    feedbackSub: "Help Sunbird AI models improve for African languages",
    submitFeedback: "Send Feedback",
  },
  lug: {
    appTitle: "Sunbird AI Speech Studio",
    tagline: "Ebyuma ebitegeera amaloboozi g'ennimi z'Afirika",
    sttTab: "Amaloboozi Okudda mu Biwandiiko",
    sttDesc: "Kyusa amaloboozi agayogeddwa mu nnimi z'Afirika gafuuke ebiwandiiko ebikakafu.",
    ttsTab: "Ebiwandiiko Okudda mu Ddoboozi",
    ttsDesc: "Funa eddoboozi ery'obutonde okuva mu biwandiiko by'owandiise.",
    uploadAudio: "Teekamu eddoboozi",
    dragAudioHint: "Sika olubuto lw'eddoboozi wano oba koona okukwata fayiro",
    dragSupportedHint: "Okukkiriza MP3, WAV, M4A, OGG (obutasinga 15MB)",
    recordAudio: "Koma eddoboozi lyo",
    recordingLive: "Tukwata eddoboozi...",
    startRecord: "Kwata eddoboozi",
    stopRecord: "Koma awo",
    trySample: "Gezako n'eddoboozi ery'okulabirako",
    sampleLuganda: "Eky'okulabirako: Amawulire mu Luganda",
    sourceLanguage: "Olulimi olwogerwa",
    searchLanguage: "Noonya olulimi...",
    transcribeBtn: "Kyusa Eddoboozi",
    transcribing: "Tukyakola...",
    transcribeAgain: "Ddamu okyuse",
    reset: "Sazaamu",
    transcriptReady: "Ebiwandiiko Biwedde",
    awaitingAudio: "Lindirira eddoboozi",
    audioReady: "Eddoboozi lyetegese",
    copy: "Koppolola",
    copied: "Bikoppoloddwa!",
    download: "Funa Ebiwandiiko",
    formatTxt: "Ebiwandiiko (.txt)",
    formatSrt: "Ebikwatagana n'ebifaananyi (.srt)",
    formatVtt: "Web Video (.vtt)",
    formatJson: "Structured (.json)",
    editTranscript: "Longoosa Ebiwandiiko",
    saveChanges: "Kaza Enkyukakyuka",
    discardChanges: "Sazaamu",
    searchInTranscript: "Noonya mu biwandiiko...",
    enterText: "Wandiika wano ebigambo...",
    characterLimit: "Ennyingo",
    generateSpeech: "Funa Eddoboozi",
    generating: "Tukola eddoboozi...",
    selectVoice: "Londa Eddoboozi",
    autoVoice: "Eddoboozi Ery'enkalakkalira",
    downloadAudio: "Wanozza Eddoboozi",
    recentJobs: "Ebyakakolebwa",
    noRecentJobs: "Tewali byakakolebwa kati.",
    reopen: "Ddamu oggulewo",
    speed: "Embiro",
    feedbackTitle: "Pima obutuufu",
    feedbackSub: "Yamba Sunbird AI okulongoosa tekinologiya w'ennimi zaffe",
    submitFeedback: "Weereza endowooza yo",
  },
};

export const getLocale = () => {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("app_locale") || "en";
};

export const setLocale = (locale) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("app_locale", locale);
};

export const t = (key, fallback = "") => {
  const locale = getLocale();
  const dict = TRANSLATIONS[locale] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || fallback || key;
};
