export const getAgeCategory = (ageMonths) => {
  if (ageMonths >= 24) return "2-5 tahun";
  if (ageMonths >= 12) return "12-23 bulan";
  if (ageMonths >= 9) return "9-11 bulan";
  if (ageMonths >= 6) return "6-8 bulan";
  return "0-6 bulan";
};