import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import config from "../configurations";
import dayjs from "./dayjsLocale";
import { TIME_UNIT_MAP_TYPE } from "../constants/type";

const JWT_SECRET = config.jwtSecret;

export const hashPassword = async (plainPassword) => {
    if (!plainPassword) return null;
    try {
        const hash = await argon2.hash(plainPassword, {
          type: argon2.argon2id,
          memoryCost: 2 ** 15,
          timeCost: 3,
          parallelism: 1
        });
        return hash;
    } catch (err) {
        console.error('Hashing error:', err);
        return null;
    }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword) return false;
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
        console.error('Verification error:', err);
        return false;
    }
};

export const generateToken = (payload) => {
  if (!JWT_SECRET) throw new Error('❌ Tambahkan JWT_SECRET di .env');
  if(!payload) return {}
  
  const expiredUnit = 2;
  const typeExpired = 'hours';

  const expired = dayjs().add(expiredUnit, typeExpired)

  const expiredUnix = expired.unix();
  const expiredDatetime = expired.toDate();
  const expiredLabel = `${expiredUnit} ${TIME_UNIT_MAP_TYPE[typeExpired] || typeExpired}`;

  const token = jwt.sign({ ...payload, exp : expiredUnix }, JWT_SECRET);

  return { expiredUnix, expiredLabel, expiredDatetime, token };
};

export const decodeToken = (token) => {
  if (!JWT_SECRET) throw new Error("❌ Tambahkan JWT_SECRET di .env");
  if (!token) return "Token empty";

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") return "Token expired";
    if (err.name === "JsonWebTokenError") return "Token invalid";
    return "Token error";
  }
};