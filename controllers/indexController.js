const adminControl = require("../controllers/adminController");
const jwt = require("jsonwebtoken");

module.exports = {
  indexView: async (req, res) => {
    try {
      if (!req.cookies.authToken) return res.send("로그인 필요합니다");
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let r_id = decoded.userId;
      const is_admin = await adminControl.getAdmin(r_id);
      res.render("index", { is_admin: is_admin });
    } catch (err) {
      console.log(err);
    }
  },
};
