export const TTS_LANGUAGE_OPTIONS = [
  { label: "Acholi", value: "ach" },
  { label: "Afrikaans", value: "afr" },
  { label: "Ateso", value: "teo" },
  { label: "English", value: "eng" },
  { label: "Ewe", value: "ewe" },
  { label: "Fulah (Fulani)", value: "ful" },
  { label: "Hausa", value: "hau" },
  { label: "Igbo", value: "ibo" },
  { label: "Kikuyu", value: "kik" },
  { label: "Kinyarwanda", value: "kin" },
  { label: "Lingala", value: "lin" },
  { label: "Luganda", value: "lug" },
  { label: "Luo (Dholuo)", value: "luo" },
  { label: "Runyankole", value: "nyn" },
  { label: "Swahili", value: "swa" },
  { label: "Xhosa", value: "xho" },
  { label: "Yoruba", value: "yor" },
];

export const DEFAULT_TTS_LANGUAGE = "lug";

export const getTtsLanguage = (languageCode) =>
  TTS_LANGUAGE_OPTIONS.find((language) => language.value === languageCode);
