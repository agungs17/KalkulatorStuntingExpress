import { formatResponse } from "../utils/scripts";

export const loginController = (_, res) => {
  return formatResponse({ identifier: 'login', res, msgSuccess: "Login successful!" });
}