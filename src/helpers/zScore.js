export const calculateZScore = (value, refData) => {
  if (!refData) return null;
  const { min3sd, min2sd, min1sd, m, plus1sd, plus2sd, plus3sd } = refData;
  if (value <= min3sd) return -3;
  if (value >= plus3sd) return 3;
  const ranges = [
    { min: min3sd, max: min2sd, zMin: -3, zMax: -2 },
    { min: min2sd, max: min1sd, zMin: -2, zMax: -1 },
    { min: min1sd, max: m, zMin: -1, zMax: 0 },
    { min: m, max: plus1sd, zMin: 0, zMax: 1 },
    { min: plus1sd, max: plus2sd, zMin: 1, zMax: 2 },
    { min: plus2sd, max: plus3sd, zMin: 2, zMax: 3 }
  ];
  for (const range of ranges) {
    if (value >= range.min && value <= range.max) {
      const proportion = (value - range.min) / (range.max - range.min);
      return range.zMin + proportion * (range.zMax - range.zMin);
    }
  }
  return null;
};

export const getZScoreLabel = (zScore) => {
  if (zScore < -3) return "Sangat Kurang";
  if (zScore < -2) return "Kurang";
  if (zScore < -1) return "Normal Bawah";
  if (zScore <= 1) return "Normal";
  if (zScore <= 2) return "Berlebih";
  if (zScore <= 3) return "Sangat Berlebih";
};