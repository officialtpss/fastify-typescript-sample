
import { SECRET_KEY } from "../config/config";
import CryptoJS from "crypto-js";
import btoa from 'btoa';

export const encrypt = (message: string): string => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export const decrypt = (message: string): string => {
  const bytes = CryptoJS.AES.decrypt(message, SECRET_KEY);
  return bytes?.toString(CryptoJS.enc.Utf8)
}

export const encryptPassword = (message: string): string => {
  return btoa(message);
}