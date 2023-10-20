import jwt from "jsonwebtoken";
import type { IToken } from "../types";

export const generateAccessToken = (data: IToken): string => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3h",
  });
};
