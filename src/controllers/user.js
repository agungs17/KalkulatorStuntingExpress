import supabaseInstance from "../services/supabaseInstance";
import { comparePassword, hashPassword } from "../helpers/encryption";
import formatResponse from "../helpers/formatResponse";
import { JWT_TYPE } from "../constants/type";

export const profileController = async (req, res) => {
  const userId = req.userId;

  try {
     const { data: user, error } = await supabaseInstance
      .from("users_table")
      .select(`id, email, password_hash, email_verification, nik, role, name, fk_users_team_id:fk_users_team_id(id, team_name), childs_table(id, nik, name, date_of_birth, gender)`)
      .eq("id", userId)
      .limit(1)
      .single();

    let code = error ? 500 : 200;
    let message = 'Profile berhasil diambil.';
    let errorMessage = error;
    let data = null;

    if (user && !error) {
      data = {
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
  } catch (error) {
    return formatResponse({ req, res, code: 500, error: String(error) });
  }
}

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