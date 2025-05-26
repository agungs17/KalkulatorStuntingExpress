import config from "../configurations";
import formatResponse from "../helpers/formatResponse";
import { nodemailerInstance } from "../services/nodemailerInstance";

export const sendEmailController = async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await nodemailerInstance.sendMail({ from: `"Kalkulator Stunting" <${config.nodemailer.email}>`, to, subject, html });

    return formatResponse({ req, res, code: 200, data: null, message: "Email berhasil dikirim." });
  } catch (err) {
     return formatResponse({ req, res, code: 500, error: String(err) });
  }
};