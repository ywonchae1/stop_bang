const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");

(exports.getNewUsersCount = async (req, res) => {
  try {
    const rows = await adminModel.getNewUsersCountModel();
    return rows;
  } catch (err) {
    console.error(err.stack);
  }
}),
  (exports.getNewAgent = async (req, res) => {
    try {
      const rows = await adminModel.getNewAgentModel();
      return rows;
    } catch (err) {
      console.error(err.stack);
    }
  }),
  (exports.getAdmin = async (r_id) => {
    try {
      const is_admin = await adminModel.getAdminModel(r_id);
      //console.log("print admin !!!!: "+is_admin.r_isadmin);

      return is_admin.r_isadmin;
    } catch (err) {}
  });
