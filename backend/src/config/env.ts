import "dotenv/config";

export const config = {
  PORT: process.env.PORT || "5000",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};

if (!process.env.PORT) {
  throw new Error("Missing PORT");
}
