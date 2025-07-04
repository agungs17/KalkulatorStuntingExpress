import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../configurations";
import { TIME_UNIT_MAP_TYPE } from "../constants/type";
import dayjs from "./dayjsLocale";

const JWT_SECRET = config.jwt.secret;
const expiredUnit = config.jwt.unitExpired;
const typeExpired = config.jwt.labelExpired;

export const hashPassword = async(plainPassword) => {
  if(!plainPassword) return null;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
};

export const comparePassword = async(plainPassword, hashPassword) => {
  if(!plainPassword || !hashPassword) return false;

  return await bcrypt.compare(plainPassword, hashPassword);
};

export const generateToken = (payload) => {
  if (!JWT_SECRET) throw new Error("❌ Tambahkan JWT_SECRET di .env");
  if(!payload) return {};

  const expired = dayjs().add(expiredUnit, typeExpired);

  const expiredUnix = expired.unix();
  const expiredDatetime = expired.toDate();
  const expiredLabel = `${expiredUnit} ${TIME_UNIT_MAP_TYPE[typeExpired] || typeExpired}`;

  const token = jwt.sign({ ...payload, exp : expiredUnix }, JWT_SECRET);

  return { expiredUnix, expiredLabel, expiredDatetime, token };
};

export const decodeToken = (token, allowExpired = false) => {
  if (!JWT_SECRET) throw new Error("❌ Tambahkan JWT_SECRET di .env");
  if (!token) return "Token empty";

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration : allowExpired || config.jwt.ignoreExpiration });
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") return "Token expired";
    if (err.name === "JsonWebTokenError") return "Token invalid";
    return "Token error";
  }
};