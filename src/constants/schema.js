import Joi from "joi";
import { GENDER_TYPE } from "./type";

const pattern = {
  date: Joi.date().iso().required().messages({
    'date.base': 'Format tanggal tidak valid',
    'date.format': 'Tanggal harus dalam format ISO (YYYY-MM-DD)',
    'any.required': 'Tanggal wajib diisi',
  }),
  name : Joi.string().trim().min(3).required().empty('').messages({
    'string.min': 'Nama minimal 3 karakter',
    'any.required': 'Nama wajib diisi',
    'string.empty': 'Nama tidak boleh kosong',
  }),
  nik: Joi.string().trim().length(16).pattern(/^\d+$/, 'numeric').required().messages({
    'string.length': 'NIK harus terdiri dari 16 digit',
    'string.pattern.name': 'NIK hanya boleh berisi angka',
    'any.required': 'NIK wajib diisi',
    'string.empty': 'NIK tidak boleh kosong',
  }),
  password : Joi.string().trim().min(6).pattern(/^(?=.*[A-Z])(?=.*\d).+$/, 'uppercase letter and number').required().empty('').messages({
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi',
    'string.empty': 'Password tidak boleh kosong',
    'string.pattern.name': 'Password harus mengandung minimal 1 huruf besar dan 1 angka'
  })
};

const childSchema = Joi.object({
  name : pattern.name,
  nik: pattern.nik,
  date_of_birth: pattern.date,
  gender: Joi.string().valid(...GENDER_TYPE).required().messages({
    'any.only': 'Format gender salah!',
    'any.required': 'Gender anak wajib diisi',
  }),
});

const defaultSchema = Joi.object({
  name: pattern.name,
  email: Joi.string().trim().email().required().empty('').messages({
    'string.email': 'Email tidak valid',
    'any.required': 'Email wajib diisi',
    'string.empty': 'Email tidak boleh kosong',
  }),
  password: pattern.password,
  confirmation_password : Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Konfirmasi password harus sama dengan password',
    'any.required': 'Konfirmasi password wajib diisi',
  }),
  nik : pattern.nik,
  date_of_birth: pattern.date,
  date_check: pattern.date,
  children: Joi.array().items(childSchema).optional(),
  role : Joi.string().trim().required().empty('').messages({
    'any.required': 'Role wajib diisi',
    'string.empty': 'Role tidak boleh kosong',
  }),
  team_name : Joi.string().trim().min(3).required().empty('').messages({
    'string.min': 'Nama tim minimal 3 karakter',
    'any.required': 'Nama tim wajib diisi',
    'string.empty': 'Nama tim tidak boleh kosong',
  })
});

export default defaultSchema;
