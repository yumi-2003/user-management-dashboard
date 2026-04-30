import "dotenv/config";

const DEFAULT_PORT = 5000;
const DEFAULT_CLIENT_URL = "http://localhost:3000";
const DEFAULT_NODE_ENV = "development";

const toPortNumber = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_PORT;
};

export const config = {
  port: toPortNumber(process.env.PORT),
  clientUrl: process.env.CLIENT_URL?.trim() || DEFAULT_CLIENT_URL,
  nodeEnv: process.env.NODE_ENV?.trim() || DEFAULT_NODE_ENV,
};
