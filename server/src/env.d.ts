declare namespace NodeJS {
  export interface ProcessEnv {
    DB_USER: string;
    DB_PASSWORD: string;
    SESSION_SECRET: string;
  }
}
