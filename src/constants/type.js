export const ROLE_TYPE = {
  user : "user",
  admin : "admin",
  staff : "staff"
};

export const JWT_TYPE = {
  login : "login",
  verificationEmail : "verification-email",
  forgotPasswordEmail : "forgot-password-email"
};

export const TIME_UNIT_MAP_TYPE  = {
  seconds: "detik",
  minutes: "menit",
  hours: "jam",
  days: "hari",
  weeks: "minggu",
  months: "bulan",
  years: "tahun"
};

export const GENDER_TYPE = ["L", "P"];

export const EMAIL_TYPE = {
  verificationEmail : {
    header : "Terima kasih telah bergabung! Untuk menyelesaikan proses pendaftaran, silakan verifikasi email Anda dengan mengklik tombol di bawah ini:",
    buttonName : "Verifikasi Sekarang"
  },
  forgotPasswordEmail : {
    header : "Untuk menyelesaikan proses ganti password, silakan tekan tombol di bawah ini:",
    buttonName : "Ganti Password"
  }
};