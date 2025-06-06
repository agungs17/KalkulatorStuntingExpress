import supabaseInstance from "../services/supabaseInstance";
import formatResponse from "../helpers/formatResponse";
import { generateToken } from "../helpers/encryption";
import { getHtml } from "../helpers/html";
import { sendEmail } from "../services/nodemailerInstance";
import { EMAIL_TYPE, JWT_TYPE } from "../constants/type";

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

    let code = 200;
    let message = "Email verifikasi berhasil dikirim ulang.";

    if(!user) {
      code = 404;
      message = "Pengguna tidak ditemukan.";
    }

    if(user.email_verification) {
      code = 400;
      message = "Email sudah terverifikasi.";
    }

    if(!error && user && !user.email_verification) {
      const type = JWT_TYPE.verificationEmail;
      const { token, expiredLabel, expiredDatetime } = generateToken({ id: userId, type });

      await supabaseInstance
        .from("tokens_table")
        .delete()
        .eq("id_user", userId)
        .eq("type", type);

      await supabaseInstance
        .from("tokens_table")
        .insert({
          id_user: userId,
          token,
          type,
          expires_at: expiredDatetime,
        });

      const html = await getHtml("email-template.html", { userName: user.name, link: `verify-email?token=${token}`, expiredLabel, ...EMAIL_TYPE.verificationEmail });
      await sendEmail({ to: user.email, subject: "Verifikasi Email Anda", html });
    }

    return formatResponse({ req, res, code, message, error });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const sendEmailForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const { data: user, error } = await supabaseInstance
      .from("users_table")
      .select("id, email, name")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let code = 200;
    let message = "Berhasil mengirim email lupa password";

    if(!user) {
      code = 404;
      message = "Pengguna tidak ditemukan.";
    }

    if(!error && user) {
      const type = JWT_TYPE.forgotPasswordEmail;
      const userId = user?.id;
      const { token, expiredLabel, expiredDatetime } = generateToken({ id: userId, type });

      await supabaseInstance
        .from("tokens_table")
        .delete()
        .eq("id_user", userId)
        .eq("type", type);

      await supabaseInstance
        .from("tokens_table")
        .insert({
          id_user: userId,
          token,
          type,
          expires_at: expiredDatetime,
        });

      const html = await getHtml("email-template.html", { userName: user.name, link: `form-password?token=${token}`, expiredLabel, ...EMAIL_TYPE.forgotPasswordEmail });
      await sendEmail({ to: user.email, subject: "Ganti Password Anda", html });
    }

    return formatResponse({ req, res, code, message, error });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};