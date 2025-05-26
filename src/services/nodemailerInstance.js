import nodemailer from "nodemailer";
import config from "../configurations";
import axiosInstance from "./axiosInstance";

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

const sendEmail = ({ to, subject, html }) => {
  if (!nodemailerInstance) throw new Error("Nodemailer not configured");

  axiosInstance.post("/api/job/send-email", {
    to: to,
    subject: subject,
    html,
  }).then((res) => {
    console.log("🚀 Email berhasil dikirim:", res?.data);
  })
  .catch((err) => {
    console.error("❌ Gagal mengirim email:", err?.message);
  });
};

export { nodemailerInstance, sendEmail };