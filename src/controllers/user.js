import supabaseInstance from "../services/supabaseInstance";
import { comparePassword, hashPassword } from "../helpers/encryption";
import formatResponse from "../helpers/formatResponse";
import { JWT_TYPE } from "../constants/type";

export const changePasswordController = async(req, res) => {
  const tokenId = req.tokenId;
  const userId = req.userId;
  const tokenType = req.tokenType;
  
  const { password } = req.body;

  try {
    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token, users_table(id, password_hash)")
      .eq("id", tokenId)
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

    if (tokenType === JWT_TYPE.forgotPasswordEmail) {
      await supabaseInstance
        .from("tokens_table")
        .delete()
        .eq("id_user", userId)
        .in("type", [JWT_TYPE.forgotPasswordEmail, JWT_TYPE.login]);
    }
    
    if (tokenType === JWT_TYPE.login) {
     await supabaseInstance
      .from("tokens_table")
      .delete()
      .eq("id_user", userId)
      .eq("type", JWT_TYPE.login)
      .not("id", "eq", tokenId);
    }

    return formatResponse({ req, res, code: 200, message: "Password berhasil diubah.", data: null });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
}