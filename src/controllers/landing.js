import supabaseInstance from "../services/supabaseInstance";
import { decodeToken } from "../helpers/encryption";
import getHtml from "../helpers/getHtml";
import { EMAIL_TYPE } from "../constants/email";

export const verifyEmailController = async(req, res) => {
  const { token } = req.query;

  const type = EMAIL_TYPE["verification-email"].type
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

export const formPasswordController = async(req, res) => {
  const { token } = req.query;

  const type = EMAIL_TYPE['forgot-password-email'].type
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