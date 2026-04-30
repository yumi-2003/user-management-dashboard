declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      CLIENT_URL: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
