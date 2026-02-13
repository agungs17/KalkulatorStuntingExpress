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
    { min: plus2sd, max: plus3sd, zMin: 2, zMax: 3 },
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

export const getConclusionAndSuggestion = (
  label,
  type,
  ageCategory = "2-5 tahun"
) => {
  const baseData = {
    weight: {
      "Sangat Kurang": {
        conclusion: "Gizi Buruk",
        suggestion:
          "Segera konsultasi ke dokter/ahli gizi. Berikan makanan tinggi energi dan protein (telur, ikan, daging, susu) dengan frekuensi lebih sering. Pantau pertumbuhan setiap bulan.",
      },
      Kurang: {
        conclusion: "Gizi Kurang",
        suggestion:
          "Tingkatkan frekuensi makan dan variasi makanan bergizi. Pastikan anak mendapat protein hewani setiap hari. Lanjutkan pemantauan berat badan rutin.",
      },
      "Normal Bawah": {
        conclusion: "Gizi Normal",
        suggestion:
          "Pertahankan pola makan sehat. Pastikan asupan gizi seimbang untuk mencapai berat badan ideal.",
      },
      Normal: {
        conclusion: "Gizi Normal",
        suggestion:
          "Pertahankan pola makan sehat dengan gizi seimbang. Lanjutkan aktivitas fisik rutin.",
      },
      Berlebih: {
        conclusion: "Risiko Gizi Lebih",
        suggestion:
          "Kurangi konsumsi makanan manis, berlemak, dan tinggi kalori. Tingkatkan aktivitas fisik. Batasi waktu layar.",
      },
      "Sangat Berlebih": {
        conclusion: "Gizi Lebih / Obesitas",
        suggestion:
          "Segera konsultasi dengan dokter spesialis anak untuk manajemen berat badan. Terapkan pola makan teratur dengan porsi terkontrol. Libatkan keluarga dalam gaya hidup sehat.",
      },
    },
    height: {
      "Sangat Kurang": {
        conclusion: "Stunting Parah",
        suggestion:
          "Segera intervensi gizi dan stimulasi. Konsultasi ke dokter untuk penanganan lebih lanjut. Pastikan asupan protein hewani setiap hari (telur, ikan, susu).",
      },
      Kurang: {
        conclusion: "Stunting",
        suggestion:
          "Tingkatkan asupan protein hewani (telur, ikan, ayam, susu). Pastikan imunisasi lengkap dan stimulasi tumbuh kembang. Pantau tinggi badan secara rutin.",
      },
      "Normal Bawah": {
        conclusion: "Tinggi Normal",
        suggestion:
          "Pertahankan pola asuh dan gizi seimbang. Stimulasi tumbuh kembang secara teratur.",
      },
      Normal: {
        conclusion: "Tinggi Normal",
        suggestion:
          "Pertahankan pola asuh dan gizi seimbang. Stimulasi tumbuh kembang secara teratur.",
      },
      Berlebih: {
        conclusion: "Tinggi",
        suggestion:
          "Tidak perlu perlakuan khusus. Tetap pertahankan pola makan sehat dan stimulasi.",
      },
      "Sangat Berlebih": {
        conclusion: "Sangat Tinggi",
        suggestion:
          "Tidak perlu perlakuan khusus. Jika ada keluhan, konsultasikan ke dokter.",
      },
    },
    heightvsweight: {
      "Sangat Kurang": {
        conclusion: "Gizi Buruk",
        suggestion:
          "Segera konsultasi ke dokter/ahli gizi. Berikan makanan tinggi energi dan protein dengan frekuensi lebih sering. Pantau berat badan setiap minggu.",
      },
      Kurang: {
        conclusion: "Gizi Kurang",
        suggestion:
          "Tingkatkan asupan kalori dan protein. Berikan makanan padat gizi seperti telur, ikan, daging. Pantau pertumbuhan secara rutin.",
      },
      "Normal Bawah": {
        conclusion: "Gizi Normal",
        suggestion:
          "Pertahankan pola makan sehat dengan gizi seimbang. Pastikan anak aktif bergerak.",
      },
      Normal: {
        conclusion: "Gizi Normal",
        suggestion:
          "Pertahankan pola makan sehat dengan gizi seimbang. Lanjutkan aktivitas fisik rutin.",
      },
      Berlebih: {
        conclusion: "Risiko Gizi Lebih",
        suggestion:
          "Atur pola makan sehat. kurangi makanan manis dan berlemak, perbanyak sayur dan buah. Tingkatkan aktivitas fisik. Batasi waktu layar.",
      },
      "Sangat Berlebih": {
        conclusion: "Obesitas",
        suggestion:
          "Segera konsultasi dengan dokter spesialis anak untuk manajemen berat badan. Terapkan pola makan teratur dengan porsi terkontrol. Libatkan keluarga dalam gaya hidup sehat.",
      },
    },
  };

  // Ambil data dasar
  let result = baseData[type]?.[label];
  if (!result) {
    return {
      conclusion: label || "",
      suggestion: "Konsultasikan dengan tenaga kesehatan.",
    };
  }

  let { conclusion, suggestion } = result;

  // Sesuaikan saran berdasarkan kategori usia (mengikuti data resep)
  if (ageCategory === "0-6 bulan") {
    // Bayi 0-5 bulan: ASI eksklusif
    if (type === "weight") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter/ahli gizi. Pastikan bayi mendapat ASI eksklusif dan perlekatan menyusui sudah benar. Pantau pertumbuhan setiap minggu.";
      } else if (label === "Normal" || label === "Normal Bawah") {
        suggestion =
          "Pertahankan ASI eksklusif. Lanjutkan pemantauan pertumbuhan rutin.";
      } else if (label === "Berlebih" || label === "Sangat Berlebih") {
        suggestion =
          "Konsultasikan dengan dokter untuk evaluasi pola menyusui. Pastikan bayi hanya diberi ASI tanpa tambahan makanan/minuman lain.";
      }
    } else if (type === "height") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter. Pastikan bayi mendapat ASI eksklusif dan stimulasi tumbuh kembang. Pantau tinggi badan setiap bulan.";
      } else {
        suggestion =
          "Pertahankan ASI eksklusif dan stimulasi tumbuh kembang. Lanjutkan pemantauan rutin.";
      }
    } else if (type === "heightvsweight") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter. Pastikan bayi mendapat ASI eksklusif dan perlekatan menyusui sudah benar. Pantau berat badan setiap minggu.";
      } else {
        suggestion = "Pertahankan ASI eksklusif. Lanjutkan pemantauan rutin.";
      }
    }
  } else if (ageCategory === "6-8 bulan") {
    // MPASI awal: tekstur lumat (puree/bubur saring)
    if (type === "weight" || type === "heightvsweight") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter/ahli gizi. Berikan MPASI dengan tekstur lumat (bubur saring) yang kaya protein hewani (telur, ikan, ayam) setiap hari. Lanjutkan ASI.";
      } else if (label === "Normal" || label === "Normal Bawah") {
        suggestion =
          "Pertahankan pemberian ASI dan MPASI dengan tekstur lumat. Perkenalkan berbagai jenis makanan secara bertahap.";
      } else if (label === "Berlebih" || label === "Sangat Berlebih") {
        suggestion =
          "Konsultasikan dengan dokter. Sesuaikan porsi MPASI dan perhatikan tanda kenyang bayi. Batalkan pemberian makanan manis.";
      }
    } else if (type === "height") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter. Pastikan MPASI mengandung protein hewani setiap kali makan. Stimulasi tumbuh kembang secara teratur.";
      } else {
        suggestion =
          "Pertahankan pemberian ASI dan MPASI dengan gizi seimbang. Lanjutkan stimulasi.";
      }
    }
  } else if (ageCategory === "9-11 bulan") {
    // MPASI lanjut: tekstur cincang halus, finger food
    if (type === "weight" || type === "heightvsweight") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter/ahli gizi. Tingkatkan kepadatan energi MPASI dengan menambah lemak sehat (minyak kelapa, santan). Berikan protein hewani setiap kali makan. Tekstur bisa dinaikkan menjadi cincang halus.";
      } else if (label === "Normal" || label === "Normal Bawah") {
        suggestion =
          "Pertahankan pemberian ASI dan MPASI dengan variasi makanan. Perkenalkan finger food untuk melatih kemandirian makan.";
      } else if (label === "Berlebih" || label === "Sangat Berlebih") {
        suggestion =
          "Konsultasikan dengan dokter. Perhatikan porsi makan dan batasi camilan tinggi gula. Tingkatkan aktivitas fisik.";
      }
    } else if (type === "height") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter. Pastikan asupan protein hewani optimal. Stimulasi tumbuh kembang dengan permainan aktif.";
      } else {
        suggestion =
          "Pertahankan pola makan sehat dan stimulasi. Lanjutkan pemantauan rutin.";
      }
    }
  } else if (ageCategory === "12-23 bulan") {
    // Batita: makanan keluarga dengan porsi kecil
    if (type === "weight" || type === "heightvsweight") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter/ahli gizi. Berikan makanan keluarga dengan porsi kecil namun sering, kaya protein hewani dan sayuran. Batasi camilan tidak sehat.";
      } else if (label === "Normal" || label === "Normal Bawah") {
        suggestion =
          "Pertahankan pola makan keluarga dengan gizi seimbang. Batasi konsumsi gula, garam, dan lemak berlebih. Ajak anak makan bersama keluarga.";
      } else if (label === "Berlebih" || label === "Sangat Berlebih") {
        suggestion =
          "Konsultasikan dengan dokter. Atur porsi makan dan batasi jajanan. Tingkatkan aktivitas fisik di luar ruangan.";
      }
    } else if (type === "height") {
      if (label === "Sangat Kurang" || label === "Kurang") {
        suggestion =
          "Segera konsultasi ke dokter. Pastikan asupan protein hewani dan stimulasi tumbuh kembang optimal.";
      } else {
        suggestion =
          "Pertahankan pola asuh dan gizi seimbang. Stimulasi tumbuh kembang secara teratur.";
      }
    }
  }
  // Untuk anak 2-5 tahun: saran dasar sudah sesuai (tidak perlu diubah)

  return { conclusion, suggestion };
};
