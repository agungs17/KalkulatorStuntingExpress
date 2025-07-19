import nodemailer from "nodemailer";
import config from "../configurations";
import workerInstance from "./workerInstance";

const configNodemailer = config?.nodemailer || {};

const nodemailerInstance = configNodemailer.useNodemailer
  ? nodemailer.createTransport({
    service: configNodemailer?.service,
    host: configNodemailer?.host,
    port: configNodemailer?.port,
    secure: configNodemailer?.port && config?.nodeEnv === "dev" ? false : true,
    auth: {
      user: configNodemailer?.email,
      pass: configNodemailer?.password,
    },
  })
  : null;

const sendEmailRaw = async ({ to, subject, html }) => {
  if (!nodemailerInstance) throw new Error("Nodemailer not configured");

  return await nodemailerInstance.sendMail({
    from: `"Kalkulator Stunting" <${configNodemailer.email}>`,
    to,
    subject,
    html,
  });
};

const sendEmail = async ({ req, to, subject, html }) => {
  if (config.upstashQStash.useUpstashQStash) return await workerInstance({req, path : "/api/worker/send-email", body : { to, subject, html }});

  return await sendEmailRaw({ to, subject, html });
};

export { sendEmail, sendEmailRaw };