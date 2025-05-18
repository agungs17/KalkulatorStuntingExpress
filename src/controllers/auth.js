export const loginController = (req, res) => {
  return formatResponse({ identifier: 'login', res, msgSuccess: "Login successful!" });
}