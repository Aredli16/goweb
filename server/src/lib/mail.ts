import nodemailer from "nodemailer";
import config from "../config/config";

export const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort,
  secure: config.mailSecure,
  ...(config.mailUser && config.mailPass
    ? {
        auth: {
          user: config.mailUser,
          pass: config.mailPass,
        },
      }
    : {}),
});
