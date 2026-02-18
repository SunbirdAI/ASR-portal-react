export const getUserFacingErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error.name === "AbortError") {
    return "The request timed out. Please check your connection and try again.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const withFallbackMessage = (error, fallback) => ({
  ...error,
  message: getUserFacingErrorMessage(error, fallback),
});
