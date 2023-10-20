import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../helpers";
import { IToken } from "../types";
import { User } from "../models";

class AuthController {
  async registration(req: Request, res: Response) {
    console.log("Body: ", req.body);
    const { password, email, username, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user: any = await User.create({
        is_online: false,
        name: name,
        email: email,
        password: hashedPassword,
        username: username,
      });

      if (user) {
        const { password, ...response } = user._doc;

        res.status(201).json({
          user: response,
          message: "Successfully Registrated!",
          status: 200,
        });
      } else {
        res.status(503).json({
          error: true,
          status: 503,
          message: "Server Error!",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      res.status(503).json({
        error: true,
        status: 503,
        message: "Server Error!",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      res.status(401).json({
        error: true,
        status: 401,
        message: "Invalid Credentials!",
        timestamp: new Date().toISOString(),
      });
    }

    const matchedPass = await bcrypt.compare(password, user.password);

    if (!matchedPass) {
      res.status(401).json({
        error: true,
        status: 401,
        message: "Invalid Credentials!",
        timestamp: new Date().toISOString(),
      });
    }

    const tokenData: IToken = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    };

    const accessToken = generateAccessToken(tokenData);

    res.status(200).json({
      message: "Successfully login !",
      status: 200,
      token: accessToken,
    });
  }
}

export default new AuthController();
