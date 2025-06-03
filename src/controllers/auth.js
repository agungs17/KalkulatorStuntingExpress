import supabaseInstance from "../services/supabaseInstance";
import formatResponse from "../helpers/formatResponse";
import { comparePassword, decodeToken, generateToken, hashPassword } from "../helpers/encryption";
import config from "../configurations";
import { getHtml } from "../helpers/html";
import { sendEmail } from "../services/nodemailerInstance";
import { EMAIL_TYPE } from "../constants/email";
import { ROLE_TYPE } from "../constants/type";

export const registerController = async (req, res) => {
  const { useNodemailer } = config.nodemailer || {};
  const { email, password, nik, name, children = [], role = 'user' } = req.body;

  if (role === ROLE_TYPE.admin) {
    return formatResponse({ req, res, code: 401, message: `Role ${role} tidak diperbolehkan.` });
  }

  try {
    const password_hash = await hashPassword(password);

    const { data: userData, error: userError } = await supabaseInstance
      .from("users_table")
      .insert({
        name,
        nik,
        email,
        password_hash,
        role,
        email_verification: !useNodemailer,
      })
      .select("id, email")
      .single();

    if (userError || !userData) {
      if (userError?.code === '23505') return formatResponse({ req, res, code: 409, message: "Email atau NIK sudah digunakan." });
      return formatResponse({ req, res, code: 500, message: "Gagal membuat akun.", error: userError });
    }

    const { id, email: emailUser } = userData;

    if (children.length > 0) {
      const childrenToInsert = children.map(child => ({
        id_parent: id,
        nik: !child?.nik || child?.nik === "" ? null : child?.nik,
        name: child.name,
        date_of_birth: child.date_of_birth,
        gender: child.gender,
      }));

      const { error: childrenError } = await supabaseInstance
        .from("childs_table")
        .insert(childrenToInsert);

      if (childrenError) {
        await supabaseInstance.from("users_table").delete().eq("id", id);
        return formatResponse({ req, res, code: 500, message: "Gagal menyimpan data anak.", error: childrenError });
      }
    }

    let message = "Registrasi berhasil.";

    if (useNodemailer) {
      const type = EMAIL_TYPE["verification-email"].type;
      const { token, expiredLabel, expiredDatetime } = generateToken({ id, type });

      const { error: tokenError } = await supabaseInstance
        .from('tokens_table')
        .insert({ id_user: id, token, type, expires_at: expiredDatetime });

      if (!tokenError) {
        const html = await getHtml("email-template.html", {
          userName: name,
          link: `verify-email?token=${token}`,
          expiredLabel,
          ...EMAIL_TYPE["verification-email"]
        });

        await sendEmail({ to: emailUser, subject: 'Verifikasi Email Anda', html });
        message += " Silakan verifikasi email Anda!";
      } else {
        message += " Gagal kirim email verifikasi, silakan login dan kirim ulang email verfikasi.";
      }
    }

    return formatResponse({ req, res, code: 200, message });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error } = await supabaseInstance
      .from("users_table")
      .select(`
        id,
        email,
        password_hash,
        email_verification,
        nik,
        role,
        name,
        fk_users_team_id:fk_users_team_id (
          id,
          team_name
        ),
        childs_table (
          id,
          nik,
          name,
          date_of_birth,
          gender
        )
      `)
      .eq("email", email)
      .limit(1)
      .single();

    let code = 200;
    let message = 'Login berhasil.';
    let errorMessage = error;
    let data = null;

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword || !user) {
      message = "Email atau password salah.";
      code = 401;
      return formatResponse({ req, res, error: message, code, data, message });
    }

    const { token, expiredDatetime } = generateToken({ id: user.id, type: "login" });

    const { error: tokenInsertError } = await supabaseInstance
      .from("tokens_table")
      .insert({
        id_user: user.id,
        token,
        type: "login",
        expires_at: expiredDatetime,
      });

    if (tokenInsertError) {
      errorMessage = tokenInsertError;
      code = 500;
    } else {
      data = {
        token,
        user: {
          email: user.email,
          nik: user.nik,
          role: user.role,
          name: user.name,
          email_verification: user.email_verification,
          childs: user.childs_table || [],
          team: user?.fk_users_team_id?.team_name || null
        }
      };
    }

    return formatResponse({ req, res, error: errorMessage, code, data, message });
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
      .select("id, token, id_user")
      .eq("token", oldToken)
      .eq("type", "login")
      .limit(1)
      .single();

    const decoded = decodeToken(tokenData?.token);
    if (decoded !== "Token expired") return formatResponse({ req, res, code: 400, message: "Token belum expired, tidak perlu refresh.", error : "Token not expired" });
    if (error || !tokenData) return formatResponse({ req, res, code: 401, message: "Token tidak ditemukan atau sudah tidak berlaku.", error : "Token not found" });

    const { token: newToken, expiredDatetime } = generateToken({ id: tokenData.id_user, type: "login" });

    await supabaseInstance
      .from("tokens_table")
      .eq("token", oldToken)
      .eq("type", "login")
      .update({ token: newToken, expires_at: expiredDatetime });

    return formatResponse({ req, res, code: 200, message: "Token berhasil diperbarui.", data: { token: newToken } });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};


