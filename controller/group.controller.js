import Group from "../model/group.model.js";
import errorHandler from "../helper/error-handler.helper.js";

class GroupController {
  async createGroup(req, res, next) {
    try {
      let { name, limit } = req.body;
      let { user_id } = req.user;

      const group = new Group({
        name,
        limit,
        creator_id: user_id,
      });

      await group.save();

      res.status(201).json({
        message: "Successfully created",
        status: 200,
        data: group,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      errorHandler(error);
    }
  }
}

export default new GroupController();
