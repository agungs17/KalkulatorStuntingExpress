import formatResponse from "../helpers/formatResponse";
import { truncateDecimal } from "../helpers/number";
import supabaseInstance from "../services/supabaseInstance";

export const addOrEditChildrenController = async (req, res) => {
  const userId = req.userId;
  const { id, id_children, height : heightParams, weight : weightParams, date_check } = req.body;

  const height = truncateDecimal(heightParams);
  const weight = truncateDecimal(weightParams);

  const isInsert = id === undefined || id === null || id === "";

  try {
    const { data: userData, error: userError } = await supabaseInstance
      .from("users_table")
      .select("id_team")
      .eq("id", userId)
      .single();

    if (userError || !userData) return formatResponse({ req, res, code: 403, message: "User tidak ditemukan.", error: userError || "Not found" });

    const { data } = await supabaseInstance
      .from("histories_child_table")
      .select("date_check")
      .eq("date_check", date_check)
      .eq("id_children", id_children)
      .single();

    if(data?.date_check) return formatResponse({ req, res, code: 400, message: "Tanggal sudah digunakan, Silahkan gunakan tanggal lain." });

    const idTeam = userData.id_team;

    // insert
    if (isInsert) {
      const { error } = await supabaseInstance
        .from("histories_child_table")
        .insert([{ id_children, id_team: idTeam, height, weight, date_check }]);

      if (error) return formatResponse({ req, res, code: 400, message: "Gagal menambahkan data histori.", error });
      return formatResponse({ req, res, code: 200, message: "Berhasil menambahkan data histori anak." });
    }

    // update
    const { data: existing, error: fetchError } = await supabaseInstance
      .from("histories_child_table")
      .select("id, id_team, id_children")
      .eq("id", id)
      .single();

    if (fetchError || !existing) return formatResponse({ req, res, code: 404, message: "Data histori tidak ditemukan.", error: fetchError || "Not found" });

    if (existing.id_team) {
      if(existing.id_team !== userData.id_team) return formatResponse({ req, res, code: 403, message: "Kamu tidak memiliki akses untuk mengedit histori ini.", error: "Forbidden" });
    } else {
      const { count, error: ownerError } = await supabaseInstance
        .from("childs_table")
        .select("id", { count: "exact", head: true })
        .eq("id", existing.id_children)
        .eq("id_user", userId);

      if (ownerError || count === 0) return formatResponse({ req, res, code: 403, message: "Kamu bukan pemilik anak ini.", error: "Forbidden" });
    }

    const { error: updateError } = await supabaseInstance
      .from("histories_child_table")
      .update({ height, weight, id_team: idTeam })
      .eq("id", id);

    if (updateError) return formatResponse({ req, res, code: 400, message: "Gagal mengupdate histori anak.", error: updateError });

    return formatResponse({ req, res, code: 200, message: "Berhasil mengupdate histori anak." });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const deleteHistoryChildrenController = async(req, res) => {
  const { id } = req.body;

  if(id === undefined || id === null || id === "") return formatResponse({ req, res, code: 400, message: "Ada yang salah dari data yang kamu kirimkan", error: "ID not found" });

  try {
    const { data: historyChild, error: historyChildError } = await supabaseInstance
      .from("histories_child_table")
      .select("id")
      .eq("id", id)
      .single();

    if (historyChildError || !historyChild) return formatResponse({ req, res, code: 404, message: "Data histori anak tidak ditemukan.", error : historyChildError });

    const { error: deleteHistoryChild } = await supabaseInstance
      .from("histories_child_table")
      .delete()
      .eq("id", id);

    if (deleteHistoryChild) throw formatResponse({ req, res, code: 500, error: deleteHistoryChild });

    return formatResponse({ req, res, code: 200, message: "Data histori anak berhasil dihapus.", data: null, });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};
