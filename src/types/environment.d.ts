export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: "test" | "dev" | "prod";
      PORT: number;
      ACCESS_TOKEN_SECRET: string;
      MONGO_STR: string;
    }
  }
}
