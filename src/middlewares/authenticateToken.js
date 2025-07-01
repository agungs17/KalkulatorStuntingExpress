import { JWT_TYPE, ROLE_TYPE } from "../constants/type";
import { decodeToken } from "../helpers/encryption";
import formatResponse from "../helpers/formatResponse";
import { getHeaders } from "../helpers/header";
import supabaseInstance from "../services/supabaseInstance";

const createMiddleware = ({ allowedRoles, requiredTypes, allowExpired = false }) => {
  return async (req, res, next) => {
    const { authorization : authHeader } = getHeaders(req);
    const bearerToken = authHeader?.replace?.("Bearer ", "");
    const queryToken = req.query.token || "";
    const token = bearerToken || queryToken || "";

    const decoded = decodeToken(token, allowExpired);

    if (decoded === "Token invalid" || decoded === "Token empty") return formatResponse({ req, res, code: 401, message: "Token tidak valid.", error: decoded });

    if (decoded === "Token expired" && !allowExpired) return formatResponse({ req, res, code: 401, message: "Token sudah kedaluwarsa.", error: decoded });

    if (!requiredTypes.includes(decoded?.type)) return formatResponse({ req, res, code: 401, message: "Jenis token tidak diizinkan.", error: "Token type invalid" });

    try {
      const { data: tokenRow, error } = await supabaseInstance
        .from("tokens_table")
        .select("id, id_user, users_table(id, role)")
        .eq("token", token)
        .eq("type", decoded.type)
        .limit(1)
        .single();

      if (error || !tokenRow) {
        return formatResponse({ req, res, code: 401, message: "Token tidak ditemukan atau tidak berlaku.", error: "Token empty" });
      }

      const userRole = tokenRow?.users_table?.role;

      if (allowedRoles && !allowedRoles.includes(userRole)) return formatResponse({ req, res, code: 403, message: "Role tidak diizinkan.", error: "Forbidden" });

      req.tokenId = tokenRow.id;
      req.userId = decoded.id;
      req.userRole = userRole;
      req.tokenType = decoded.type;
      next();
    } catch (err) {
      return formatResponse({ req, res, code: 500, error: String(err) });
    }
  };
};

const authenticateToken = (optionsOrReq, res, next) => {
  const defaultOptions = {
    allowedRoles: [ROLE_TYPE.user, ROLE_TYPE.staff],
    requiredTypes: [JWT_TYPE.login],
    allowExpired: false
  };

  if (typeof optionsOrReq === "object" && optionsOrReq.headers) {
    const middleware = createMiddleware(defaultOptions);
    return middleware(optionsOrReq, res, next);
  }

  const options = { ...defaultOptions, ...optionsOrReq };
  return createMiddleware(options);
};

export default authenticateToken;
