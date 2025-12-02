import formatResponse from "../helpers/formatResponse";
import { truncateDecimal } from "../helpers/number";
import supabaseInstance from "../services/supabaseInstance";
import { getFilePublic } from "../helpers/path";
import dayjs from "../helpers/dayjsLocale";
import { calculateZScore, getZScoreLabel } from "../helpers/zScore";

export const addOrEditChildrenController = async (req, res) => {
  const userId = req.userId;
  const { id, id_children, height : heightParams, weight : weightParams, date_check } = req.body;

  const height = truncateDecimal(heightParams);
  const weight = truncateDecimal(weightParams);

  const isInsert = id === undefined || id === null || id === "";

  try {
    const { data: childData, error: childError } = await supabaseInstance
      .from("childs_table")
      .select("date_of_birth")
      .eq("id", id_children)
      .single();

    if (childError || !childData) {
      return formatResponse({
        req,
        res,
        code: 404,
        message: "Data anak tidak ditemukan.",
        error: childError || "Child not found",
      });
    }

    const dateBirth = dayjs(childData.date_of_birth).startOf("day");
    const dateCheck = dayjs(date_check).startOf("day");

    // Tidak boleh sebelum lahir
    if (dateCheck.isBefore(dateBirth)) {
      return formatResponse({
        req,
        res,
        code: 400,
        message: "Tanggal pengecekan tidak boleh sebelum tanggal lahir.",
      });
    }

    // Maksimal 5 tahun dari tanggal lahir
    const maxDate = dateBirth.add(5, "year");
    if (dateCheck.isAfter(maxDate)) {
      return formatResponse({
        req,
        res,
        code: 400,
        message: "Tanggal pengecekan maksimal 5 tahun setelah tanggal lahir.",
      });
    }

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

export const getChildrenController = async (req, res) => {
  const userId = req.userId;
  const { id_children } = req.query;

  const calculateCurrentAge = (dateOfBirth, checkDate = null) => {
    const birthDate = dayjs(dateOfBirth);
    const now = checkDate ? dayjs(checkDate) : dayjs();
    const years = now.diff(birthDate, "year");
    const months = now.diff(birthDate, "month") % 12;
    return `${years} Tahun ${months} Bulan`;
  };

  try {
    const { data: userData, error: userErr } = await supabaseInstance
      .from("users_table")
      .select("role, id_team")
      .eq("id", userId)
      .single();

    if (userErr || !userData) {
      return formatResponse({
        req, res,
        code: 403,
        message: "User tidak ditemukan.",
        error: userErr
      });
    }

    const isStaff = userData.role === "staff";
    const currentTeam = userData.id_team;

    let children = [];
    let childError = null;

    if (isStaff) {
      const { data: teamUsers, error: teamUserError } = await supabaseInstance
        .from("users_table")
        .select("id")
        .eq("id_team", currentTeam);

      if (teamUserError) {
        return formatResponse({
          req, res,
          code: 500,
          message: "Gagal mendapatkan anggota tim.",
          error: teamUserError
        });
      }

      const userIds = teamUsers.map(u => u.id);

      const { data, error } = await supabaseInstance
        .from("childs_table")
        .select("id, date_of_birth, gender, name")
        .in("id_user", userIds);

      children = data;
      childError = error;

    } else {
      const { data, error } = await supabaseInstance
        .from("childs_table")
        .select("id, date_of_birth, gender, name")
        .eq("id_user", userId);

      children = data;
      childError = error;
    }

    if (childError) {
      return formatResponse({
        req, res,
        code: 500,
        message: "Gagal mendapatkan data anak.",
        error: childError
      });
    }

    if (!children || children.length === 0) {
      return formatResponse({
        req, res,
        code: 200,
        message: "Berhasil mendapatkan history anak.",
        data: [],
        error: null
      });
    }

    let filteredChildren = children;
    if (id_children) {
      filteredChildren = children.filter(c => c.id === id_children);

      if (filteredChildren.length === 0) {
        return formatResponse({
          req, res,
          code: 404,
          message: "Anak tidak ditemukan atau tidak dalam tim / kepemilikan user.",
          error: null
        });
      }
    }

    const childIds = filteredChildren.map(c => c.id);
    let histories = [];
    let historyError = null;

    if (isStaff) {
      const { data, error } = await supabaseInstance
        .from("histories_child_table")
        .select("id, id_children, id_team, height, weight, date_check")
        .eq("id_team", currentTeam);

      histories = data;
      historyError = error;

    } else {
      const { data, error } = await supabaseInstance
        .from("histories_child_table")
        .select("id, id_children, id_team, height, weight, date_check")
        .in("id_children", childIds);

      histories = data;
      historyError = error;
    }

    if (historyError) {
      return formatResponse({
        req, res,
        code: 500,
        message: "Gagal mendapatkan data histori anak.",
        error: historyError
      });
    }

    const beratRaw = await getFilePublic("json", "berat_table.json");
    const tinggiRaw = await getFilePublic("json", "tinggi_table.json");
    const tinggiVsBeratRaw = await getFilePublic("json", "tinggivsberat_table.json");

    const beratTable = JSON.parse(beratRaw);
    const tinggiTable = JSON.parse(tinggiRaw);
    const tinggivsberatTable = JSON.parse(tinggiVsBeratRaw);

    const result = histories
      .map(h => {
        const child = children.find(c => c.id === h.id_children);
        if (!child) return null;

        const ageMonths = Math.abs(dayjs(child.date_of_birth).diff(dayjs(h.date_check), "month"));

        const weightRef = beratTable.find(item => item.jenis_kelamin === child.gender && item.usia_bulan === ageMonths);
        const heightRef = tinggiTable.find(item => item.jenis_kelamin === child.gender && item.usia_bulan === ageMonths);

        const roundedHeight = Math.round(Number(h.height));
        const weightForHeightRef = tinggivsberatTable.find(item => item.jenis_kelamin === child.gender && item.kelompok_usia === (ageMonths < 24 ? "bayi" : "anak") && item.tinggi === roundedHeight);

        const zScoreWeight = calculateZScore(Number(h.weight), weightRef);
        const zScoreHeight = calculateZScore(Number(h.height), heightRef);
        const zScoreWeightForHeight = calculateZScore(Number(h.weight), weightForHeightRef);

        return {
          children_name: child.name,
          id: h.id,
          id_children: h.id_children,
          id_team: h.id_team || "",
          age_in_months: ageMonths,
          age_label: calculateCurrentAge(child.date_of_birth, h.date_check),
          weight: Number(h.weight),
          height: Number(h.height),
          date_check: h.date_check,
          z_score_weight: zScoreWeight !== null ? `${zScoreWeight >= 0 ? "+" : ""}${zScoreWeight.toFixed(1)}` : null,
          z_score_height: zScoreHeight !== null ? `${zScoreHeight >= 0 ? "+" : ""}${zScoreHeight.toFixed(1)}` : null,
          z_score_heightvsweight: zScoreWeightForHeight !== null ? `${zScoreWeightForHeight >= 0 ? "+" : ""}${zScoreWeightForHeight.toFixed(1)}` : null,
          z_score_weight_label: getZScoreLabel(zScoreWeight),
          z_score_height_label: getZScoreLabel(zScoreHeight),
          z_score_heightvsweight_label: getZScoreLabel(zScoreWeightForHeight)
        };
      }).filter(Boolean);

    result.sort((a, b) => a.age_in_months - b.age_in_months);
    const lastData = result[result.length - 1] || null;

    if (!id_children) {
      return formatResponse({
        req, res,
        code: 200,
        message: "Berhasil mendapatkan semua history anak.",
        data: result,
        error: null
      });
    }

    return formatResponse({
      req, res,
      code: 200,
      message: `Berhasil mendapatkan history anak ${filteredChildren[0]?.name}.`,
      data: {
        children_name: filteredChildren[0]?.name || "",
        age_label: filteredChildren?.[0]?.date_of_birth ? calculateCurrentAge(filteredChildren[0].date_of_birth) : "",
        date_of_birth: filteredChildren?.[0]?.date_of_birth || "",
        last_z_score_weight: lastData?.z_score_weight || "",
        last_z_score_weight_label: lastData?.z_score_weight_label || "",
        last_z_score_height: lastData?.z_score_height || "",
        last_z_score_height_label: lastData?.z_score_height_label || "",
        last_z_score_heightvsweight: lastData?.z_score_heightvsweight || "",
        last_z_score_heightvsweight_label: lastData?.z_score_heightvsweight_label || "",
        milestones: result
      },
      error: null
    });

  } catch (err) {
    return formatResponse({
      req, res,
      code: 500,
      message: "Terjadi kesalahan server.",
      error: String(err)
    });
  }
};

