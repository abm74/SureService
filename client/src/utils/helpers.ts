import axios from "axios";

export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char: string) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT" ||
      (typeof error.message === "string" && error.message.toLowerCase().includes("timeout"))
    ) {
      return "The server is taking too long to respond. Please check your connection and try again.";
    }

    if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      (!error.response && error.request)
    ) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    const serverErrors = error.response?.data?.errors;
    if (Array.isArray(serverErrors) && serverErrors.length > 0) {
      return serverErrors.join(". ");
    }

    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    if (typeof serverMessage === "string" && serverMessage.trim().length > 0) {
      return serverMessage;
    }

    switch (error.response?.status) {
      case 400:
        return "The request was invalid. Please check your input and try again.";
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested information could not be found.";
      case 409:
        return "A conflict occurred with existing records. Please review and try again.";
      case 429:
        return "Too many requests. Please wait a moment before trying again.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "The server is currently unavailable. Please try again shortly.";
      default:
        return fallbackMessage;
    }
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("timeout")) {
      return "The server is taking too long to respond. Please check your connection and try again.";
    }
    if (error.message === "Network Error") {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
}
