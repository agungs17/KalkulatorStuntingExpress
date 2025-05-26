import supabaseInstance from "../services/supabaseInstance";
import { ROLE_TYPE } from "../constants/type";
import formatResponse from "../helpers/formatResponse";
import { comparePassword, decodeToken, generateToken, hashPassword } from "../helpers/encryption";
import config from "../configurations";
import getHtml from "../helpers/getHtml";
import { sendEmail } from "../services/nodemailerInstance";
import { EMAIL_TYPE } from "../constants/email";

export const registerController = async (req, res) => {
  const { useNodemailer } = config.nodemailer || {};
  const { email, password, nik, name, children = [] } = req.body;

  try {
    const { data, error } = await supabaseInstance
      .from("users_table")
      .insert([
        {
          name,
          nik,
          email,
          password_hash: await hashPassword(password),
          role: ROLE_TYPE.user,
          email_verification: !useNodemailer,
        },
      ])
      .select("id, email");

    let code = 200;
    let message = "Registrasi berhasil.";
    const constraint = error?.message || "";
    if (constraint.includes("users_table_email_key")) {
      message = "Email telah digunakan.";
      code = 409;
    } else if (constraint.includes("users_table_nik_key")) {
      message = "NIK telah digunakan.";
      code = 409;
    }

    const { id, email : emailUser } = data?.[0] || {};

    if (code === 200 && id && children.length > 0) {
      const childrenToInsert = children.map((child) => ({ id_parent: id, nik: child.nik, name: child.name, date_of_birth: child.date_of_birth, gender: child.gender }));
      const { error: childrenError } = await supabaseInstance.from("childs_table").insert(childrenToInsert);

      if (childrenError) message += " Tetapi gagal menyimpan data anak.";
    }

    if (code === 200 && id && useNodemailer) {
      const type = "email-verification";
      const {token, expiredLabel, expiredDatetime} = generateToken({ id, type });
      await supabaseInstance
        .from('tokens_table')
        .insert({ user_id: id, token, type, expires_at: expiredDatetime });
      
      const html = await getHtml("email-template.html", { userName: name, link: `verify-email?token=${token}`, expiredLabel, ...EMAIL_TYPE.verify_email });
      sendEmail({ to : emailUser, subject : 'Verifikasi Email Anda', html })
      message += " silahkan verifikasi email anda!";
    }

    return formatResponse({ req, res, code, error, message });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error } = await supabaseInstance
      .from("users_table")
      .select("id, email, password_hash, email_verification")
      .eq("email", email)
      .limit(1)
      .single();

    let code = 200
    let message = 'Login berhasil.'
    let errorMessage = error
    let data = null

    const validPassword = await comparePassword(password, user?.password_hash);
    if (!validPassword) {
      message = "Email atau password salah."
      code = 401
    }
    
    if(!error && validPassword) {
      const { token, expiredDatetime } = generateToken({ id: user.id, type: "login" });
      
      const { error: tokenInsertError } = await supabaseInstance
        .from("tokens_table")
        .insert({
          user_id: user?.id,
          token,
          type: "login",
          expires_at: expiredDatetime,
        });

      if(tokenInsertError) {
        errorMessage = tokenInsertError
        code = 500
      } else {
        data = {
          token,
          email_verification: user?.email_verification
        }
      }
    }
    
    return formatResponse({ req, res, error : errorMessage, code, data, message });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const refreshTokenController = async (req, res) => {
  const {token : oldToken} = req.body;


  const decodedOldToken = decodeToken(oldToken);
  if ((decodedOldToken === "Token invalid" || decodedOldToken === "Token empty" || decodedOldToken?.type !== "login") && decodedOldToken !== 'Token expired') return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : decodedOldToken });

  try {
    const { data: tokenData, error } = await supabaseInstance
      .from("tokens_table")
      .select("id, token, user_id")
      .eq("token", oldToken)
      .eq("type", "login")
      .limit(1)
      .single();

    const decoded = decodeToken(tokenData?.token);
    if (decoded !== "Token expired") return formatResponse({ req, res, code: 400, message: "Token belum expired, tidak perlu refresh.", error : "Token not expired" });
    if (error || !tokenData) return formatResponse({ req, res, code: 401, message: "Token tidak ditemukan atau sudah tidak berlaku.", error : "Token not found" });

    await supabaseInstance
      .from("tokens_table")
      .delete()
      .eq("token", oldToken)
      .eq("type", "login");

    const { token: newToken, expiredDatetime } = generateToken({ id: tokenData.user_id, type: "login" });

    await supabaseInstance
      .from("tokens_table")
      .insert({ user_id: tokenData.user_id, token: newToken, type: "login", expires_at: expiredDatetime });

    return formatResponse({ req, res, code: 200, message: "Token berhasil diperbarui.", data: { token: newToken } });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};


