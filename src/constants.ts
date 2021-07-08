import * as dotenv from 'dotenv';
dotenv.config();

export const API_URL = `http://localhost:${process.env.PORT}`;
export const REDIRECT_URI = `${API_URL}/auth/google-sign-up`;