// model.js
const db = require("../config/db");

exports.getNewUsersCountModel = async () => {

  try {
    console.log("I'm in the model");
    const query = `SELECT COUNT(*) as userCount
                    FROM resident
                    WHERE YEAR(created_time) = YEAR(CURRENT_DATE())
                    AND MONTH(created_time) = MONTH(CURRENT_DATE());`;
    const [rows, fields] = await db.query(query);
    console.log("new user's number : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},

exports.getAdminModel = async(r_id) => {
  try{
    console.log("in model");
    const query = `SELECT * FROM resident WHERE r_id = ?`
    const [rows,fields] = await db.query(query,[r_id]);
    const ob = rows[0];
    const result= ob.r_isadmin;
    //console.log("***admin : ", result);
    return result;

  } catch (err) {
    console.error(err);
  throw err;
}

};


