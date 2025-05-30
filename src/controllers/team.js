import { ROLE_TYPE } from "../constants/type";
import formatResponse from "../helpers/formatResponse";
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
      .select("role")
      .eq("id", userId)
      .single();

    if (errorUser || !user) {
      code = 500;
      message = "Gagal membuat tim. User tidak ditemukan.";
      error = errorUser || "User not found";
    } else if (user.role !== ROLE_TYPE.staff) {
      code = 401;
      message = "Kamu tidak diperbolehkan membuat tim.";
    } else {
      const { data: team, error: errorTeam } = await supabaseInstance
        .from("teams_table")
        .insert({ id_user: userId, team_name })
        .select("id")
        .single();

      if (errorTeam || !team) {
        code = 500;
        message = "Gagal membuat tim.";
        error = errorTeam || "Insert gagal";
      } else {
        await supabaseInstance
          .from("users_table")
          .update({ team_id: team.id })
          .eq("id", userId);
      }
    }

    return formatResponse({ req, res, code, error, message, data: null });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};
