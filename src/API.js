// import pRetry from "p-retry";

const FEEDBACK_URL = process.env.REACT_APP_FEEDBACK_URL;
// const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY;
export const tracking_id = process.env.REACT_APP_GA4_TRACKING_ID;
export const token = localStorage.getItem('access_token')
	? localStorage.getItem('access_token')
	: process.env.REACT_APP_SB_API_TOKEN;
console.log(`Current Token: ${token}`);

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
	formData.append('audio', audioData); // You might need to adjust the filename.
	formData.append('language', languageCode);
	formData.append('adapter', adapterCode);

	try {
		const response = await fetch(asrUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error recognizing speech:', error);
		throw error; // Re-throw the error to be handled by the caller
	}
}

export async function getTranscripts() {
	const ascendingTranscriptUrl = `${asrDbUrl}?order_by=uploaded&descending=true`;
	try {
		const response = await fetch(`${ascendingTranscriptUrl}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
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
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
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
	formData.append('transcription_text', transcript);
	try {
		const response = await fetch(asrDbUpdateUrl, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
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
			`${process.env.REACT_APP_SB_API_URL}/auth/register`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: values.name,
					email: values.email,
					organization: values.organisation,
					password: values.password,
					account_type: 'Free',
				}),
			}
		);

		const responseBody = await response.json();
		if (response.status === 400) {
			data.error = responseBody.detail || 'Invalid username or email';
		} else if (response.status === 201) {
			data.success = 'Account succressfully created';
			console.log('message', responseBody);
		}
	} catch (error) {
		data.error = 'Something went wrong';
		console.error('Error occurred during form submission:', error);
		throw error;
	}
	return data;
};

export const loginIntoAccount = async (values) => {
	let data = {};
	const formData = new FormData();
	formData.append('username', values.username);
	formData.append('password', values.password);

	try {
		const response = await fetch(
			`${process.env.REACT_APP_SB_API_URL}/auth/token`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},
				body: formData,
			}
		);
		const responseBody = await response.json();
		console.log(`Response: ${response.ok} Status code: ${response.status}`);
		if (response.status === 200) {
			data.success = 'Successful Login!';
			localStorage.setItem('access_token', responseBody.access_token);
		} else if (response.status === 401) {
			data.error = responseBody.detail;
		}
	} catch (error) {
		data.error = 'Something went wrong';
		console.error('Error occurred during form submission:', error);
		throw error;
	}
	return data;
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
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
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
