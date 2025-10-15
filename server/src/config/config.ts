import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  mailHost: string;
  mailPort: number;
  mailSecure: boolean;
  mailUser?: string;
  mailPass?: string;
  mailReceiver?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb://root:root@localhost:27017/goweb?authSource=admin",
  mailHost: process.env.MAIL_HOST || "smtp.gmail.com",
  mailPort: Number(process.env.MAIL_PORT) || 587,
  mailSecure: process.env.MAIL_SECURE === "true",
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  mailReceiver: process.env.MAIL_RECEIVER,
};

export default config;
