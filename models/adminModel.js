// model.js
const db = require("../config/db");

exports.getNewUsersCountModel = async () => {

  try {
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
exports.getNewAgentModel = async () => {

  try {
    const query = `SELECT * 
                    FROM agent
                    WHERE a_auth = 0;`;
    const [rows, fields] = await db.query(query);
    console.log("new agent member : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},

exports.getAdminModel = async(r_username) => {
  try{
    const query = `SELECT * FROM resident WHERE r_username = ?`
    const [rows,fields] = await db.query(query,[r_username]);
    const result = rows[0];
    //const result= ob.r_isadmin;
    //console.log("***admin : ", result);
    return result;

  } catch (err) {
    console.error(err);
  throw err;
}

};


