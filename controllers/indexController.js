const adminControl = require("../controllers/adminController");
const jwt = require("jsonwebtoken");

module.exports = {
  indexView: async (req, res) => {
    try {
      if(req.cookies.authToken) {
        const decoded = jwt.verify(
          req.cookies.authToken,
          process.env.JWT_SECRET_KEY
        );
        let r_id = decoded.userId;
        const is_admin = await adminControl.getAdmin(r_id);
        res.render("index", { is_admin: is_admin });
      }
      res.render("index");
    } catch (err) {
      console.log(err);
    }
  }
};
