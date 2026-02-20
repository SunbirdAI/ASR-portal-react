const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL;
export const tracking_id = import.meta.env.VITE_GA4_TRACKING_ID;

const asrUrl = `${import.meta.env.VITE_SB_API_URL}/tasks/stt`;
const ttsUrl =
  import.meta.env.VITE_SB_TTS_URL ||
  "https://sb-modal-ws--spark-tts-salt-sparktts-generate.modal.run";
const asrDbUrl = `${import.meta.env.VITE_SB_API_URL}/transcriptions`;
const REQUEST_TIMEOUT_MS = 45000;
const NO_REQUEST_TIMEOUT = 0;
const NETWORK_ERROR_PATTERN = /failed to fetch|networkerror|load failed/i;

const getAuthToken = () =>
  localStorage.getItem("access_token") || import.meta.env.VITE_SB_API_TOKEN;

const parseResponsePayload = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
};

const toErrorMessage = (payload, fallback) => {
  if (!payload) return fallback;

  if (typeof payload === "string") return payload;

  if (typeof payload.detail === "string") return payload.detail;
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;

  return fallback;
};

const mapStatusToMessage = (status, fallback) => {
  if (status === 400) return "Your request could not be processed. Please check the inputs.";
  if (status === 401) return "You are not authorized. Please sign in again.";
  if (status === 403) return "You do not have access to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 408 || status === 504) return "The backend took longer than expected. Please try again.";
  if (status === 413) return "The uploaded file is too large.";
  if (status === 429) return "Too many requests. Please wait and try again.";
  if (status >= 500) return "The server is currently unavailable. Please try again shortly.";
  return fallback;
};

const normalizeRequestError = (error, fallbackMessage) => {
  if (error?.name === "AbortError") {
    return new Error("The request timed out. Please try again.");
  }

  if (
    error instanceof TypeError &&
    NETWORK_ERROR_PATTERN.test(error.message || "")
  ) {
    return new Error("Network connection issue. Please check your internet and try again.");
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(fallbackMessage);
};

const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = REQUEST_TIMEOUT_MS
) => {
  if (
    typeof timeoutMs !== "number" ||
    Number.isNaN(timeoutMs) ||
    timeoutMs <= 0
  ) {
    return fetch(url, options);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const requestJson = async (url, options, fallbackMessage, timeoutMs = REQUEST_TIMEOUT_MS) => {
  try {
    const response = await fetchWithTimeout(url, options, timeoutMs);
    const payload = await parseResponsePayload(response);

    if (!response.ok) {
      const statusFallback = mapStatusToMessage(response.status, fallbackMessage);
      throw new Error(toErrorMessage(payload, statusFallback));
    }

    if (!payload || typeof payload !== "object") {
      throw new Error(fallbackMessage);
    }

    return payload;
  } catch (error) {
    throw normalizeRequestError(error, fallbackMessage);
  }
};

const requestBlob = async (
  url,
  options,
  fallbackMessage,
  timeoutMs = REQUEST_TIMEOUT_MS
) => {
  try {
    const response = await fetchWithTimeout(url, options, timeoutMs);

    if (!response.ok) {
      const payload = await parseResponsePayload(response);
      const statusFallback = mapStatusToMessage(response.status, fallbackMessage);
      throw new Error(toErrorMessage(payload, statusFallback));
    }

    const blob = await response.blob();
    if (!blob.size) {
      throw new Error("The service returned an empty file. Please try again.");
    }
    return blob;
  } catch (error) {
    throw normalizeRequestError(error, fallbackMessage);
  }
};

/**
 * Recognizes speech from an audio file and returns the transcribed text.
 */
export async function recognizeSpeech(audioData, languageCode, adapterCode) {
  const formData = new FormData();
  formData.append("audio", audioData);
  formData.append("language", languageCode);
  formData.append("adapter", adapterCode);
  formData.append("whisper", true);

  return requestJson(
    asrUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
      body: formData,
    },
    "Unable to transcribe audio right now. Please try again.",
    NO_REQUEST_TIMEOUT
  );
}

/**
 * Generates speech audio from text.
 */
export async function generateSpeech(text, speakerID = "248") {
  const normalizedText = text?.trim();
  const normalizedSpeakerID = `${speakerID || "248"}`.trim();

  if (!normalizedText) {
    throw new Error("Please enter text before generating speech.");
  }

  const queryParams = new URLSearchParams({
    text: normalizedText,
    speaker_id: normalizedSpeakerID || "248",
  });

  return requestBlob(
    `${ttsUrl}?${queryParams.toString()}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/wav, audio/*, */*",
      },
    },
    "Unable to generate speech right now. Please try again.",
    NO_REQUEST_TIMEOUT
  );
}

export async function getTranscripts() {
  const transcriptsUrl = `${asrDbUrl}?order_by=uploaded&descending=true`;

  return requestJson(
    transcriptsUrl,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
    },
    "Unable to load recent files right now."
  );
}

export async function getSingleTranscript(id) {
  return requestJson(
    `${asrDbUrl}/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
    },
    "Unable to load this transcription right now."
  );
}

export async function updateTranscript(id, transcript) {
  const formData = new FormData();
  formData.append("transcription_text", transcript);

  return requestJson(
    `${asrDbUrl}/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
      body: formData,
    },
    "Unable to save changes right now."
  );
}

export const registerNewAccount = async (values) => {
  const formErrorFallback = "Unable to create account right now. Please try again.";

  try {
    const response = await fetchWithTimeout(
      `${import.meta.env.VITE_SB_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.name,
          email: values.email,
          organization: values.organisation,
          password: values.password,
          account_type: "Free",
        }),
      }
    );

    const payload = await parseResponsePayload(response);

    if (response.status === 201) {
      return { success: "Account successfully created." };
    }

    return {
      error: toErrorMessage(
        payload,
        mapStatusToMessage(response.status, formErrorFallback)
      ),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error:
        error?.name === "AbortError"
          ? "Registration timed out. Please try again."
          : formErrorFallback,
    };
  }
};

export const loginIntoAccount = async (values) => {
  const formData = new FormData();
  formData.append("username", values.username);
  formData.append("password", values.password);

  try {
    const response = await fetchWithTimeout(
      `${import.meta.env.VITE_SB_API_URL}/auth/token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const payload = await parseResponsePayload(response);

    if (response.status === 200 && payload?.access_token) {
      localStorage.setItem("access_token", payload.access_token);
      return { success: "Successful login." };
    }

    return {
      error: toErrorMessage(
        payload,
        mapStatusToMessage(response.status, "Unable to sign in. Please try again.")
      ),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error:
        error?.name === "AbortError"
          ? "Sign in timed out. Please try again."
          : "Unable to sign in right now. Please try again.",
    };
  }
};

export const sendFeedback = async (
  feedback,
  username,
  language,
  transcription = null,
  audio_url = null,
  transcriptionID = null,
  comment
) => {
  const time = Date.now();
  if (!FEEDBACK_URL) {
    throw new Error("Feedback service is not configured. Please try again later.");
  }

  return requestJson(
    FEEDBACK_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Timestamp: time,
        feedback,
        Language: language,
        username,
        TranscriptionText: transcription,
        AudioURL: audio_url,
        TranscriptionID: transcriptionID,
        Comment: comment,
        FeedBackType: "ASRPortal",
      }),
    },
    "Unable to submit feedback right now."
  );
};
