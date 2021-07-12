import * as dotenv from 'dotenv';
dotenv.config();

export const API_URL = `http://localhost:${process.env.PORT}`;
export const REDIRECT_URI = `${API_URL}/auth/google-sign-up`;
export const REDIRECT_TO_FRONT = () => {
  return process.env.NODE_ENV === 'development' ? `http://localhost:3002` : `http://localhost:3002`
}