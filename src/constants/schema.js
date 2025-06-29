import Joi from "joi";
import { GENDER_TYPE } from "./type";
import dayjs from "../helpers/dayjsLocale";

const today = dayjs().endOf("day").toDate();
const fiveYearsAgo = dayjs().subtract(5, "year").startOf("day").toDate();

const pattern = {
  id: Joi.string().optional().strip(),
  date: Joi.date().iso().max(today).required().messages({
    "date.base": "Format tanggal tidak valid",
    "date.format": "Tanggal harus format (YYYY-MM-DD)",
    "date.max": "Tanggal lahir tidak boleh melebihi hari ini",
    "any.required": "Tanggal wajib diisi",
  }),
  minfiveYearDate: Joi.date()
    .iso()
    .min(fiveYearsAgo)
    .max(today)
    .required()
    .messages({
      "date.base": "Format tanggal tidak valid",
      "date.format": "Tanggal harus format (YYYY-MM-DD)",
      "date.min": "Tanggal lahir tidak boleh lebih dari 5 tahun",
      "date.max": "Tanggal lahir tidak boleh melebihi hari ini",
      "any.required": "Tanggal wajib diisi",
    }),
  name: Joi.string().trim().min(3).required().empty("").messages({
    "string.min": "Nama minimal 3 karakter",
    "any.required": "Nama wajib diisi",
    "string.empty": "Nama tidak boleh kosong",
  }),
  nik: Joi.string()
    .trim()
    .length(16)
    .pattern(/^\d+$/, "numeric")
    .required()
    .messages({
      "string.length": "NIK harus terdiri dari 16 digit",
      "string.pattern.name": "NIK hanya boleh berisi angka",
      "any.required": "NIK wajib diisi",
      "string.empty": "NIK tidak boleh kosong",
    }),
  password: Joi.string()
    .trim()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*\d).+$/, "uppercase letter and number")
    .required()
    .empty("")
    .messages({
      "string.min": "Password minimal 6 karakter",
      "any.required": "Password wajib diisi",
      "string.empty": "Password tidak boleh kosong",
      "string.pattern.name":
        "Password harus mengandung minimal 1 huruf besar dan 1 angka",
    }),
  gender : Joi.string()
    .valid(...GENDER_TYPE)
    .required()
    .messages({
      "any.only": "Format jenis kelamin salah!",
      "any.required": "Jenis kelamin wajib diisi",
      "string.empty": "Jenis kelamin tidak boleh kosong"
    }),
};

const childSchema = Joi.object({
  id: pattern.id,
  name: pattern.name,
  nik: pattern.nik.optional().allow(""),
  date_of_birth: pattern.minfiveYearDate,
  gender: pattern.gender
});

const defaultSchema = Joi.object({
  id: pattern.id,
  id_children : pattern.id,
  name: pattern.name,
  email: Joi.string().trim().email().required().empty("").messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
    "string.empty": "Email tidak boleh kosong",
  }),
  old_password: pattern.password,
  password: pattern.password,
  confirmation_password: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Konfirmasi password harus sama dengan password",
      "any.required": "Konfirmasi password wajib diisi",
    }),
  nik: pattern.nik,
  children: Joi.array().items(childSchema).optional(),
  role: Joi.string().trim().required().empty("").messages({
    "any.required": "Role wajib diisi",
    "string.empty": "Role tidak boleh kosong",
  }),
  team_name: Joi.string().trim().min(3).required().empty("").messages({
    "string.min": "Nama tim minimal 3 karakter",
    "any.required": "Nama tim wajib diisi",
    "string.empty": "Nama tim tidak boleh kosong",
  }),
  height: Joi.number().min(30).max(130).required().messages({
    "number.base": "Tinggi badan harus berupa angka",
    "number.min": "Tinggi badan minimal adalah 30 cm",
    "number.max": "Tinggi badan maksimal adalah 130 cm",
    "any.required": "Tinggi badan wajib diisi",
  }),
  weight: Joi.number().min(1).max(40).required().messages({
    "number.base": "Berat badan harus berupa angka",
    "number.min": "Berat badan minimal adalah 1 kg",
    "number.max": "Berat badan maksimal adalah 40 kg",
    "any.required": "Berat badan wajib diisi",
  }),
  gender : pattern.gender,
  date_of_birth: pattern.minfiveYearDate,
  date_check: pattern.date,
});

export default defaultSchema;
