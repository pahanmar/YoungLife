import dotenv from 'dotenv';
dotenv.config();
export default {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
  ACCESS_EXPIRES: process.env.ACCESS_EXPIRES || '15m',
  REFRESH_EXPIRES_DAYS: Number(process.env.REFRESH_EXPIRES_DAYS || 7),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};