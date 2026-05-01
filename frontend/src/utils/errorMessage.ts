import axios from "axios";

export function getErrMsg(err: unknown) {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data;
    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }
  return err instanceof Error ? err.message : String(err);
}

export function toClientErrorMessage(err: unknown, fallback: string) {
  const rawMessage = getErrMsg(err).trim();
  const normalizedMessage = rawMessage.toLowerCase();

  if (
    normalizedMessage.includes("email") &&
    (normalizedMessage.includes("already exist") ||
      normalizedMessage.includes("already exists"))
  ) {
    return "Account with this email is already exist";
  }

  if (
    normalizedMessage === "request failed with status code 400" ||
    normalizedMessage === "bad request"
  ) {
    return fallback;
  }

  return rawMessage || fallback;
}
