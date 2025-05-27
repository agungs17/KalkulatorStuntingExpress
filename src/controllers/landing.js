import supabaseInstance from "../services/supabaseInstance";
import { comparePassword, decodeToken, hashPassword } from "../helpers/encryption";
import getHtml from "../helpers/getHtml";
import formatResponse from "../helpers/formatResponse";
import { EMAIL_TYPE } from "../constants/email";

export const verifyEmailController = async(req, res) => {
  const { token } = req.query;

  const type = EMAIL_TYPE["verification-email"].value
  const decoded = decodeToken(token)
  if(decoded?.type !== type || decoded === 'Token expired' || decoded === "Token invalid" || decoded === "Token empty") return res.status(401).send('Token tidak valid atau sudah kedaluwarsa.');

  try {
    const userId = decoded?.id;

    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token")
      .eq("user_id", userId)
      .eq("type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

      if (error || !data) return res.status(400).send("Link tidak valid.");

    const { error: updateError } = await supabaseInstance
      .from("users_table")
      .update({ email_verification: true })
      .eq("id", userId);

    if (updateError) return res.status(500).send("Gagal memperbarui status verifikasi email.");
    else {
      await supabaseInstance
        .from("tokens_table")
        .delete()
        .eq("user_id", userId)
        .eq("type", type);
    }

    return res.status(200).send("Email berhasil diverifikasi. Terima kasih!");
  } catch (err) {
    return res.status(500).send("Sepertinya ada yang tidak beres.");
  }
}

export const changePasswordEmailController = async(req, res) => {
  const { token } = req.query;

  const type = EMAIL_TYPE['forgot-password-email'].value
  const decoded = decodeToken(token)
  if(decoded?.type !== type || decoded === 'Token expired' || decoded === "Token invalid" || decoded === "Token empty") return res.status(401).send('Token tidak valid atau sudah kedaluwarsa.');

  try {
    const userId = decoded?.id;

    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token")
      .eq("user_id", userId)
      .eq("type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

      if (error || !data) return res.status(400).send("Link tidak valid.");

      const html = await getHtml('email-change-password.html')

      return res .status(200).send(html);

  } catch (err) {
    return res.status(500).send("Sepertinya ada yang tidak beres.");
  }
}

export const verifyPasswordEmailController = async(req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const { password } = req.body

  const type = EMAIL_TYPE["forgot-password-email"].value
  const decoded = decodeToken(token);
  if (decoded === 'Token expired' || decoded === "Token invalid" || decoded === "Token empty") return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : decoded });
  if (decoded?.type !== type) return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : "Token type invalid" });

  const userId = decoded?.id;

  try {
    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token, users_table(id, password_hash)")
      .eq("user_id", userId)
      .eq("type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data || token !== data?.token) return formatResponse({ req, res, code: 400, message: "Link tidak valid." });

    const cPassword = await comparePassword(password, data?.users_table?.password_hash)
    if(cPassword) return formatResponse({ req, res, code: 400, message: "Password baru tidak boleh sama dengan password sebelumnya." });

    const { error: updateError } = await supabaseInstance
      .from("users_table")
      .update({ password_hash : await hashPassword(password) })
      .eq("id", userId);

    if (updateError) return formatResponse({ req, res, code: 500, message: "Gagal mengubah password.", error: updateError });

    await supabaseInstance
      .from("tokens_table")
      .delete()
      .eq("user_id", userId)
      .in("type", [type, "login"]);

    return formatResponse({ req, res, code: 200, message: "Password berhasil diubah.", data: null });

  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
}