// import pRetry from "p-retry";

const FEEDBACK_URL = process.env.REACT_APP_FEEDBACK_URL;
// const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY;
export const tracking_id = process.env.REACT_APP_GA4_TRACKING_ID;
export const token = process.env.REACT_APP_SB_API_TOKEN;

const asrUrl = `${process.env.REACT_APP_SB_API_URL}/tasks/stt`;

const asrDbUrl = `${process.env.REACT_APP_SB_API_URL}/transcriptions`;

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

  try {
    const response = await fetch(asrUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_SB_API_TOKEN}`,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.audio_transcription;
  } catch (error) {
    console.error("Error recognizing speech:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function getTranscripts() {
  try {
    const response = await fetch(`${asrDbUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_SB_API_TOKEN}`,
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
        Authorization: `Bearer ${process.env.REACT_APP_SB_API_TOKEN}`,
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
        Authorization: `Bearer ${process.env.REACT_APP_SB_API_TOKEN}`,
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
  const formData = new FormData();
  formData.append("email", values.email);
  formData.append("username", values.name);
  formData.append("organization", values.organisation);
  formData.append("password", values.password);
  formData.append("confirm_password", values.confirmPassword);

  try {
    const response = await fetch(
      `${process.env.REACT_APP_SB_API_URL}/register`,
      {
        method: "POST",
        headers: {
          Accept: "text/html",
        },
        body: formData,
      }
    );

    if (response.redirected) {
      // Extract the alert message from the redirect URL if available
      const urlParams = new URLSearchParams(new URL(response.url).search);
      const alertMessage = urlParams.get("alert");
      data.success = alertMessage || "Your account has been created";
    } else {
      const responseText = await response.text();
      const errorMessage = extractErrorMessageFromHTML(responseText);
      data.error = errorMessage || "Something went wrong";
      console.log("message", errorMessage);
    }
  } catch (error) {
    data.error = "Something went wrong";
    console.error("Error occurred during form submission:", error);
    throw error;
  }
  return data;
};

const extractErrorMessageFromHTML = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const errorElement = doc.querySelector("p.text-red-500");
  return errorElement ? errorElement.textContent : null;
};

export const sendFeedback = async (
  feedback,
  CorrectTranslation,
  username,
  sourceText,
  translation,
  from,
  to
) => {
  const time = Date.now();
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Timestamp: time,
      feedback: feedback,
      SourceText: sourceText,
      LanguageFrom: from,
      LanguageTo: to,
      username: username,
      CorrectTranslation: CorrectTranslation,
      TranslatedText: translation,
    }),
  };
  const response = await (await fetch(FEEDBACK_URL, requestOptions)).json();
  return response;
};
