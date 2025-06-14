import formatResponse from "../helpers/formatResponse";
import supabaseInstance from "../services/supabaseInstance";

export const addOrEditChildrenController = async (req, res) => {
  const userId = req.userId;
  const { children } = req.body;

  try {
    const inserts = [];
    const updates = [];

    for (const child of children) {
      const { id, nik, name, date_of_birth, gender } = child;
      const nikValue = nik === undefined || nik === null || nik === "" ? null : nik;
      const idValue = id === undefined || id === null || id === "" ? undefined : id;
      if (idValue) updates.push({ id : idValue, nik : nikValue, name, date_of_birth, gender, id_user: userId, });
      else inserts.push({ nik : nikValue, name, date_of_birth, gender, id_user: userId, });
    }

    if (inserts.length > 0) {
      const insertResult = await supabaseInstance
        .from("childs_table")
        .insert(inserts);

      if (insertResult.error) {
        throw insertResult.error;
      }
    }

    if (updates.length > 0) {
      for (const update of updates) {
        const { id, ...fields } = update;

        const { error } = await supabaseInstance
          .from("childs_table")
          .update(fields)
          .eq("id", id)
          .eq("id_user", userId);

        if (error) {
          throw error;
        }
      }
    }

    return formatResponse({ req, res, code: 200, message: "Data anak berhasil disimpan.", data: null, });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: err });
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

    if (childError || !child) return formatResponse({ req, res, code: 404, message: "Data anak tidak ditemukan atau bukan milik pengguna." });

    const { error: deleteChildError } = await supabaseInstance
      .from("childs_table")
      .delete()
      .eq("id", id)
      .eq("id_user", userId);

    if (deleteChildError) throw deleteChildError;

    return formatResponse({ req, res, code: 200, message: "Data anak berhasil dihapus.", data: null, });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};


