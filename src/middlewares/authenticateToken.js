import { decodeToken } from "../helpers/encryption";
import formatResponse from "../helpers/formatResponse";
import supabaseInstance from "../services/supabaseInstance";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  const decoded = decodeToken(token);
  if (decoded === 'Token expired' || decoded === "Token invalid" || decoded === "Token empty") return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : decoded });
  if (decoded?.type !== "login") return formatResponse({ req, res, code: 401, message: "Token tidak valid atau sudah kedaluwarsa.", error : "Token type invalid" });

  try {
    const { data: tokenRow, error } = await supabaseInstance
    .from("tokens_table")
    .select("id")
    .eq("token", token)
    .eq("type", "login")
    .limit(1)
    .single();

    if (error || !tokenRow) return formatResponse({ req, res, code: 401, message: "Token tidak ditemukan atau sudah tidak berlaku.", error : "Token not found" });

    req.userId = decoded.id;
    next();

  } catch (error) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};

export default authenticateToken