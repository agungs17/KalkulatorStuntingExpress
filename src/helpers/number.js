export const truncateDecimal = (value, decimals = 1) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};
