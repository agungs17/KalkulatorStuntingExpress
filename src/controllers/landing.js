import supabaseInstance from "../services/supabaseInstance";
import { getHtml } from "../helpers/html";
import { JWT_TYPE } from "../constants/type";

export const verifyEmailController = async(req, res) => {
  const userId = req?.userId;
  
  try {
    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token")
      .eq("id_user", userId)
      .eq("type", JWT_TYPE.verificationEmail)
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
        .eq("id_user", userId)
        .eq("type", JWT_TYPE.verificationEmail);
    }

    return res.status(200).send("Email berhasil diverifikasi. Terima kasih!");
  } catch (err) {
    return res.status(500).send("Sepertinya ada yang tidak beres.");
  }
}

export const formPasswordController = async(req, res) => {
  const userId = req?.userId;

  try {
    const { data, error } = await supabaseInstance
      .from("tokens_table")
      .select("token")
      .eq("id_user", userId)
      .eq("type", JWT_TYPE.forgotPasswordEmail)
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