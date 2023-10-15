import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import errorHandler from "../helper/error-handler.helper.js";
import generateAccessToken from "../helper/generat-access-token.helper.js";

class UserController {
  async registration(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({
        message: "Successfully registered",
        status: 200,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        res.status(401).json({
          error: true,
          message: "Invalid Crenditials!",
          timestamp: new Date().toISOString(),
        });

        return;
      }

      console.log("User Info: ", user);

      const comparedPass = await bcrypt.compare(password, user.password);

      if (!comparedPass) {
        res.status(401).json({
          error: true,
          message: "Invalid Crenditials!",
          timestamp: new Date().toISOString(),
        });

        return;
      }

      const payload = {
        user_id: user._id,
        email: user.email,
        name: user.name,
      };

      const accessToken = generateAccessToken(payload);

      res.status(200).json({
        message: "Successfully login",
        status: 200,
        token: accessToken,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async getUsers(req, res) {
    try {
      console.log("User: ", req.user);

      const users = await User.find({
        _id: {
          $nin: [req.user.user_id],
        },
      });

      res.status(200).json({
        message: "Get Users !",
        status: 200,
        data: users,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
}

export default new UserController();
