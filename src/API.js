// import pRetry from "p-retry";

const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL;
// const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
export const tracking_id = import.meta.env.VITE_GA4_TRACKING_ID;
export const token = localStorage.getItem("access_token")
  ? localStorage.getItem("access_token")
  : import.meta.env.VITE_SB_API_TOKEN;

const asrUrl = `${import.meta.env.VITE_SB_API_URL}/tasks/stt`;
const ttsUrl =
  import.meta.env.VITE_SB_TTS_URL;

const asrDbUrl = `${import.meta.env.VITE_SB_API_URL}/transcriptions`;

// const textToSpeechUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-lug-tts";

/**
 * Recognizes speech from an audio file and returns the transcribed text.
 * @param {Blob} audioData - The audio file as a Blob.
 * @param {string} languageCode - The language code (e.g.,  "eng","lug","nyn","teo","lgg","ach").
 * @param {string} adapterCode - The adapter code (e.g.,  "eng","lug","nyn","teo","lgg","ach").
 * @return {Promise<string>} The recognized text.
 */
export async function recognizeSpeech(audioData, languageCode, adapterCode) {
  const formData = new FormData();
  formData.append("audio", audioData); // You might need to adjust the filename.
  formData.append("language", languageCode);
  formData.append("adapter", adapterCode);
  formData.append("whisper", true);

  try {
    const response = await fetch(asrUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error recognizing speech:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Generates speech audio from text.
 * @param {string} text - Text to convert into speech.
 * @param {string|number} speakerID - Speaker ID supported by the TTS service.
 * @return {Promise<Blob>} WAV audio blob.
 */
export async function generateSpeech(text, speakerID = "248") {
  const normalizedText = text?.trim();
  const normalizedSpeakerID = `${speakerID || "248"}`.trim();

  if (!normalizedText) {
    throw new Error("Text is required for text-to-speech generation.");
  }

  const queryParams = new URLSearchParams({
    text: normalizedText,
    speaker_id: normalizedSpeakerID || "248",
  });

  try {
    const response = await fetch(`${ttsUrl}?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        Accept: "audio/wav, audio/*, */*",
      },
    });

    if (!response.ok) {
      const responseMessage = await response.text();
      throw new Error(
        responseMessage || `TTS request failed with status ${response.status}`
      );
    }

    const audioBlob = await response.blob();
    if (!audioBlob.size) {
      throw new Error("TTS service returned an empty audio file.");
    }
    return audioBlob;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}

export async function getTranscripts() {
  const ascendingTranscriptUrl = `${asrDbUrl}?order_by=uploaded&descending=true`;
  try {
    const response = await fetch(`${ascendingTranscriptUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSingleTranscript(id) {
  const asrDbSingleUrl = `${asrDbUrl}/${id}`;
  try {
    const response = await fetch(asrDbSingleUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateTranscript(id, transcript) {
  const asrDbUpdateUrl = `${asrDbUrl}/${id}`;

  const formData = new FormData();
  formData.append("transcription_text", transcript);
  try {
    const response = await fetch(asrDbUpdateUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const registerNewAccount = async (values) => {
  let data = {};

  try {
    const response = await fetch(
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

    const responseBody = await response.json();
    if (response.status === 400) {
      data.error = responseBody.detail || "Invalid username or email";
    } else if (response.status === 201) {
      data.success = "Account succressfully created";
      console.log("message", responseBody);
    }
  } catch (error) {
    data.error = "Something went wrong";
    console.error("Error occurred during form submission:", error);
    throw error;
  }
  return data;
};

export const loginIntoAccount = async (values) => {
  let data = {};
  const formData = new FormData();
  formData.append("username", values.username);
  formData.append("password", values.password);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SB_API_URL}/auth/token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      }
    );
    const responseBody = await response.json();
    console.log(`Response: ${response.ok} Status code: ${response.status}`);
    if (response.status === 200) {
      data.success = "Successful Login!";
      localStorage.setItem("access_token", responseBody.access_token);
    } else if (response.status === 401) {
      data.error = responseBody.detail;
    }
  } catch (error) {
    data.error = "Something went wrong";
    console.error("Error occurred during form submission:", error);
    throw error;
  }
  return data;
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
  const requestOptions = {
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
  };

  try {
    const response = await fetch(FEEDBACK_URL, requestOptions);
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
