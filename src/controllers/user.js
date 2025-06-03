import supabaseInstance from "../services/supabaseInstance";
import { comparePassword, decodeToken, hashPassword } from "../helpers/encryption";
import { EMAIL_TYPE } from "../constants/email";
import formatResponse from "../helpers/formatResponse";

export const changePasswordController = async(req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const { password } = req.body

  const typeForgotPasswordEmail = EMAIL_TYPE["forgot-password-email"].type
  const typeLogin = "login"
  const allowedTypes = [typeForgotPasswordEmail, typeLogin];

  const decoded = decodeToken(token);
  if (decoded === 'Token expired' || decoded === "Token invalid" || decoded === "Token empty") return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : decoded });
  if (!allowedTypes.includes(decoded?.type)) return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : "Token type invalid" });

  const userId = decoded?.id;

  try {
    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token, users_table(id, password_hash)")
      .eq("id_user", userId)
      .eq("type", decoded?.type)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if(error) return formatResponse({ req, res, code: 500, message: "Gagal mengubah password.", error });
    const cPassword = await comparePassword(password, data?.users_table?.password_hash)
    if(cPassword) return formatResponse({ req, res, code: 400, message: "Password baru tidak boleh sama dengan password sebelumnya." });

    const { error: updateError } = await supabaseInstance
      .from("users_table")
      .update({ password_hash : await hashPassword(password) })
      .eq("id", userId);

    if (updateError) return formatResponse({ req, res, code: 500, message: "Gagal mengubah password.", error: updateError });

    if (decoded?.type === typeForgotPasswordEmail) {
      await supabaseInstance
        .from("tokens_table")
        .delete()
        .eq("id_user", userId)
        .in("type", [typeForgotPasswordEmail, typeLogin]);
    }
    
    if (decoded?.type === typeLogin) {
     await supabaseInstance
      .from("tokens_table")
      .delete()
      .filter("id_user", "eq", userId)
      .filter("type", "eq", typeLogin)
      .filter("token", "neq", token);
    }

    return formatResponse({ req, res, code: 200, message: "Password berhasil diubah.", data: null });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
}