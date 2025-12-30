import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import config from '../config.js';

export const signAccess = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.ACCESS_EXPIRES });
};

export const verifyAccess = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};

export const createRefreshString = () => randomUUID();