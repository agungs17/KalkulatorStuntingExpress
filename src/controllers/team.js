import CACHE_KEYS from "../constants/cache";
import { ROLE_TYPE } from "../constants/type";
import formatResponse from "../helpers/formatResponse";
import { deleteCache } from "../services/cacheInstance";
import supabaseInstance from "../services/supabaseInstance";

export const createTeamController = async (req, res) => {
  const userId = req.userId;
  const { team_name } = req.body;

  let code = 200;
  let message = "Berhasil membuat tim.";
  let error = null;

  try {
    const { data: user, error: errorUser } = await supabaseInstance
      .from("users_table")
      .select("role, id_team")
      .eq("id", userId)
      .single();

    if (errorUser || !user) {
      code = 500;
      message = "Gagal membuat tim. User tidak ditemukan.";
      error = errorUser;
    } else if (user.id_team) {
      code = 400;
      message = "Kamu sudah memiliki tim. Hapus tim terlebih dahulu.";
    } else if (user.role !== ROLE_TYPE.staff) {
      code = 401;
      message = "Hanya petugas kesehatan yang dapat membuat tim. Jika kamu petugas kesehatan ubah profilemu";
    } else {
      const { data: team, error: errorTeam } = await supabaseInstance
        .from("teams_table")
        .insert({ id_user: userId, team_name })
        .select("id")
        .single();

      if (errorTeam || !team) {
        code = 500;
        message = "Gagal membuat tim.";
        error = errorTeam;
      } else {
        await supabaseInstance
          .from("users_table")
          .update({ id_team: team.id })
          .eq("id", userId);
      }
    }

    await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
    return formatResponse({ req, res, code, error, message });
  } catch (err) {
    return formatResponse({
      req,
      res,
      code: 500,
      error: String(err)
    });
  }
};

export const addTeamController = async (req, res) => {
  const userId = req.userId;
  const { email } = req.body;

  try {
    const { data: ownedTeam, error: teamErr } = await supabaseInstance
      .from("teams_table")
      .select("id, id_user")
      .eq("id_user", userId)
      .single();

    if (teamErr || userId !== ownedTeam?.id_user) return formatResponse({ req, res, code: 403, message: "Anda bukan owner tim mana pun—tidak bisa menambahkan anggota.", error : teamErr });

    const teamId = ownedTeam.id;

    const { data: targetUser, error: userErr } = await supabaseInstance
      .from("users_table")
      .select("id, role, id_team, email, email_verification")
      .eq("email", email)
      .single();

    if (userErr || !targetUser) return formatResponse({ req, res, code: 404, message: "User tidak ditemukan.", error : targetUser });
    if (targetUser.id === userId) return formatResponse({ req, res, code: 400, message: "Anda tidak dapat menambahkan diri sendiri ke dalam tim." });
    if (targetUser.id_team !== null) return formatResponse({ req, res, code: 409, message: "User tersebut sudah tergabung dalam tim lain." });
    if (!targetUser.email_verification) return formatResponse({ req, res, code: 403, message: "User belum verifikasi email." });
    if (targetUser.role !== ROLE_TYPE.staff) return formatResponse({ req, res, code: 401, message: "User bukan petugas kesehatan" });

    const { error: updateErr } = await supabaseInstance
      .from("users_table")
      .update({ id_team: teamId })
      .eq("id", targetUser.id);

    if (updateErr) return formatResponse({ req, res, code: 500, message: "Gagal menambahkan user ke dalam tim.", error: updateErr });

    await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
    return formatResponse({ req, res, code: 200, message: "User berhasil ditambahkan ke tim.", data: null });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const changeTeamLeaderController = async (req, res) => {
  const userId = req.userId;
  const { email } = req.body;

  try {
    const { data: requester, error } = await supabaseInstance
      .from("users_table")
      .select("id, id_team, fk_users_team_id(id, id_user, team_name)")
      .eq("id", userId)
      .single();

    if (error || !requester.fk_users_team_id) return formatResponse({ req, res, code: 400, message: "Kamu tidak tergabung dalam tim manapun." });

    const team = requester.fk_users_team_id;

    if (team.id_user !== userId) return formatResponse({ req, res, code: 403, message: "Hanya ketua tim yang bisa mengganti ketua." });

    const { data: targetUser, error: targetError } = await supabaseInstance
      .from("users_table")
      .select("id, name, email, id_team")
      .eq("email", email)
      .single();

    if (targetError || targetUser.id_team !== team.id) return formatResponse({ req, res, code: 404, message: "User tidak ditemukan di dalam tim." });
    if(requester.id === targetUser.id) return formatResponse({ req, res, code: 400, message: "Kamu sudah menjadi ketua tim." });

    const { error: updateError } = await supabaseInstance
      .from("teams_table")
      .update({ id_user: targetUser.id })
      .eq("id", team.id);

    if (updateError) return formatResponse({ req, res, code: 500, message: "Gagal mengganti ketua tim." });

    await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
    return formatResponse({ req, res, code: 200, message: `Berhasil menjadikan ${targetUser.name} sebagai ketua tim.` });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export const leaveTeamController = async (req, res) => {
  const userId = req.userId;
  const { email } = req.body;

  try {
    const { data: user, error: userError } = await supabaseInstance
      .from("users_table")
      .select("id, email, id_team")
      .eq("id", userId)
      .single();

    if (!user.id_team || userError) return formatResponse({ req, res, code: 400, error: userError, message:  "Kamu tidak tergabung dalam tim." });

    const { data: team, error: teamError } = await supabaseInstance
      .from("teams_table")
      .select("id, team_name, id_user")
      .eq("id", user.id_team)
      .single();

    if (teamError || !team) return formatResponse({ req, res, code: 404, error: teamError, message: "Tim tidak ditemukan." });

    const isOwner = (team.id_user === userId);

    const { data: targetUser, error: targetUserError } = await supabaseInstance
      .from("users_table")
      .select("id, id_team")
      .eq("email", email)
      .single();

    if (targetUserError || !targetUser) return formatResponse({ req, res, code: 404, error: teamError, message: "User tidak ditemukan." });

    if (targetUser.id_team !== user.id_team) return formatResponse({ req, res, code: 403, message: "User bukan anggota tim yang sama." });

    if (isOwner) {
      if (targetUser.id === userId) return formatResponse({ req, res, code: 403, message: "Owner tidak bisa keluar dari tim." });

      const { error: updateError } = await supabaseInstance
        .from("users_table")
        .update({ id_team: null })
        .eq("id", targetUser.id);

      if (updateError) return formatResponse({ req, res, code: 500, error: updateError, message: "Gagal menghapus anggota dari tim." });

      return formatResponse({ req, res, code: 200, data: null, message: "Berhasil mengeluarkan dari tim." });
    } else {
      if (targetUser.id !== userId) return formatResponse({ req, res, code: 403, message: "Tidak boleh mengeluarkan anggota lain." });

      const { error: leaveError } = await supabaseInstance
        .from("users_table")
        .update({ id_team: null })
        .eq("id", userId);

      if (leaveError)  return formatResponse({ req, res, code: 500, error: leaveError, message: "Gagal keluar dari tim." });

      await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
      return formatResponse({ req, res, code: 200, data: null, message: "Berhasil keluar dari tim." });
    }
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};


export const deleteTeamController = async (req, res) => {
  const userId = req.userId;

  let code = 200;
  let message = "Tim berhasil dihapus.";
  let error = null;

  try {
    const { data: team, error: errorGet } = await supabaseInstance
      .from("teams_table")
      .select("id, id_user")
      .eq("id_user", userId)
      .single();

    if (errorGet || !team || team?.id_user !== userId) {
      code = 404;
      message = "Tim tidak ditemukan atau kamu bukan pembuat tim.";
      error = errorGet;
    } else {
      const { error: errorDelete } = await supabaseInstance
        .from("teams_table")
        .delete()
        .eq("id", team.id);

      if (errorDelete) {
        code = 500;
        message = "Gagal menghapus tim.";
        error = errorDelete;
      }
    }

    await deleteCache(CACHE_KEYS.GET_PROFILE(userId));
    return formatResponse({ req, res, code, message, error });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err), });
  }
};
