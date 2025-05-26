import supabaseInstance from "../services/supabaseInstance";
import formatResponse from "../helpers/formatResponse";
import { generateToken } from "../helpers/encryption";
import getHtml from "../helpers/getHtml";
import { sendEmail } from "../services/nodemailerInstance";
import { EMAIL_TYPE } from "../constants/email";

export const resendEmailVerificationController = async (req, res) => {
  const userId = req.userId;
  try {
    const { data: user, error } = await supabaseInstance
      .from("users_table")
      .select("email, name, email_verification")
      .eq("id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let code = 200
    let message = "Email verifikasi berhasil dikirim ulang."

    if(!user) {
      code = 404
      message = "Pengguna tidak ditemukan."
    }

    if(user.email_verification) {
      code = 400
      message = "Email sudah terverifikasi."
    }

    if(!error && user && !user.email_verification) {
      const { token, expiredLabel, expiredDatetime } = generateToken({ id: userId, type: "email-verification" });

      await supabaseInstance
      .from("tokens_table")
      .delete()
      .eq("user_id", userId)
      .eq("type", "email-verification");

      await supabaseInstance
      .from("tokens_table")
      .insert({
        user_id: userId,
        token,
        type: "email-verification",
        expires_at: expiredDatetime,
      });

      const html = await getHtml("email-template.html", { userName: user.name, link: `verify-email?token=${token}`, expiredLabel, ...EMAIL_TYPE.verify_email });
      sendEmail({ to: user.email, subject: "Verifikasi Email Anda", html });
    }
    
    return formatResponse({ req, res, code, message, error });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const sendEmailForgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const { data: user, error } = await supabaseInstance
      .from("users_table")
      .select("id, email, name")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let code = 200
    let message = "Berhasil mengirim email lupa password"

    if(!user) {
      code = 404
      message = "Pengguna tidak ditemukan."
    }

    if(!error && user) {
      const userId = user?.id
      const { token, expiredLabel, expiredDatetime } = generateToken({ id: userId, type: "forgot-password-email" });

      await supabaseInstance
      .from("tokens_table")
      .delete()
      .eq("user_id", userId)
      .eq("type", "forgot-password-email");

      await supabaseInstance
      .from("tokens_table")
      .insert({
        user_id: userId,
        token,
        type: "forgot-password-email",
        expires_at: expiredDatetime,
      });

      const html = await getHtml("email-template.html", { userName: user.name, link: `change-password?token=${token}`, expiredLabel, ...EMAIL_TYPE.forgot_password_email });
      sendEmail({ to: user.email, subject: "Ganti Password Anda", html });
    }

    return formatResponse({ req, res, code, message, error });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
}