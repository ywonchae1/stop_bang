const adminControl = require("../controllers/adminController");

module.exports = {
  indexView: async(req, res) => {
      try{
              let r_id = req.cookies.authToken;
              const is_admin = await adminControl.getAdmin(r_id);
              res.render("index",{is_admin:is_admin});

          }catch(err){
            console.log(err);
          }


        },
};
