import bcrypt from "bcryptjs";

const ROUNDS = 10;

export const hashPassword = async (password: string) => bcrypt.hash(password, ROUNDS);

export const verifyPassword = async (password: string, hash: string) => bcrypt.compare(password, hash);
