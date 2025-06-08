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
      const nikValue = !nik || nik === "" ? null : nik;
      if (id) updates.push({ id, nik : nikValue, name, date_of_birth, gender, id_parent: userId, });
      else inserts.push({ nik : nikValue, name, date_of_birth, gender, id_parent: userId, });
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
          .eq("id_parent", userId);

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

