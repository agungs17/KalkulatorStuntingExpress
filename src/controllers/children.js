import CACHE_KEYS from "../constants/cache";
import formatResponse from "../helpers/formatResponse";
import { eachFirstCapitalWord } from "../helpers/string";
import { deleteCache } from "../services/cacheInstance";
import supabaseInstance from "../services/supabaseInstance";

export const addOrEditChildrenController = async (req, res) => {
  const userId = req.userId;
  const { id, nik, name, date_of_birth, gender, history_ilness } = req.body;

  const isInsert = id === undefined || id === null || id === "";

  try {
    if(isInsert) {
      // insert
      const { error } = await supabaseInstance
        .from("childs_table")
        .insert({ id_user : userId, nik, name : eachFirstCapitalWord(name), date_of_birth, gender : eachFirstCapitalWord(gender), history_ilness : eachFirstCapitalWord(history_ilness) });

      if (error) return formatResponse({ req, res, code: 400, message: "Gagal menambahkan data anak.", error });

      await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
      return formatResponse({ req, res, code: 200, message: "Berhasil menambahkan data anak." });
    }

    // update
    const { data: existing, error: fetchError } = await supabaseInstance
      .from("childs_table")
      .select("id")
      .eq("id", id)
      .eq("id_user", userId)
      .single();

    if (fetchError || !existing)  return formatResponse({ req, res, code: 404, message: "Data anak tidak ditemukan.", error: fetchError || "Not found" });

    const { error } = await supabaseInstance
      .from("childs_table")
      .update({ nik, name : eachFirstCapitalWord(name), date_of_birth, gender : eachFirstCapitalWord(gender), history_ilness : eachFirstCapitalWord(history_ilness) })
      .eq("id", id)
      .eq("id_user", userId);

    if (error) return formatResponse({ req, res, code: 400, message: "Gagal mengupdate data anak.", error });

    await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
    return formatResponse({ req, res, code: 200, message: "Berhasil mengupdate data anak." });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const deleteChildrenController = async (req, res) => {
  const userId = req.userId;
  const { id } = req.body;

  if(id === undefined || id === null || id === "") return formatResponse({ req, res, code: 400, message: "Ada yang salah dari data yang kamu kirimkan", error: "ID not found" });

  try {
    const { data: child, error: childError } = await supabaseInstance
      .from("childs_table")
      .select("id")
      .eq("id", id)
      .eq("id_user", userId)
      .single();

    if (childError || !child) return formatResponse({ req, res, code: 404, message: "Data anak tidak ditemukan atau bukan milik pengguna.", error : childError });

    const { error: deleteChildError } = await supabaseInstance
      .from("childs_table")
      .delete()
      .eq("id", id)
      .eq("id_user", userId);

    if (deleteChildError) throw formatResponse({ req, res, code: 500, error: deleteChildError });

    await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
    return formatResponse({ req, res, code: 200, message: "Data anak berhasil dihapus.", data: null, });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};


