// model.js
const db = require("../config/db");

exports.getNewUsersCountModel = async () => {

  try {
    const query = `SELECT COUNT(*) as userCount
                    FROM resident
                    WHERE YEAR(created_time) = YEAR(CURRENT_DATE())
                    AND MONTH(created_time) = MONTH(CURRENT_DATE());`;
    const [rows, fields] = await db.query(query);
    
    
    //console.log("new user's number : ", rows);
  
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
    //console.log("new agent member : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},
exports.getReportModel = async () => {

  try {
    const query = ` select * from report p left join review v on p.repo_rv_id = v.rv_id;`;
    const [rows, fields] = await db.query(query);
    //console.log("reported comment : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},
exports.getOneReportModel = async (rvid) => {

  try {
    const query = ` select * from report p left join review v on p.repo_rv_id = v.rv_id where v.rv_id =?`;
    const [rows, fields] = await db.query(query,[rvid]);
    console.log("get report model : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},
exports.deleteCommentModel = async (rvid) => {

  try {
    const query = ` START TRANSACTION; 
                    DELETE FROM opened_review WHERE review_rv_id = ?;
                    DELETE review, report  FROM review  JOIN report  ON review.rv_id = report.repo_rv_id  WHERE review.rv_id = ?; 
                    COMMIT;`;
    const [rows, fields] = await db.query(query,[rvid,rvid]);

  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},
exports.deleteReportModel = async (rvid) => {

  try {
    const query = ` delete report from report where repo_rv_id =?;`;
    const [rows, fields] = await db.query(query,[rvid]);
    
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},
exports.getAgentModel = async (regno) => {

  try {
    const query = `SELECT * 
                    FROM agent
                    WHERE agentList_ra_regno = ?;`;
    const [rows, fields] = await db.query(query,[regno]);
    //console.log("agent : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
},

exports.getAdminModel = async(r_id) => {
  try{
    const query = `SELECT * FROM resident WHERE r_id = ?`
    const [rows,fields] = await db.query(query,[r_id]);
    const result = rows[0];
    //const result= ob.r_isadmin;
    //console.log("***admin : ", result);
    return result;

  } catch (err) {
    console.error(err);
  throw err;
}

},

exports.confirmModel = async(regno,a_id) => {
  try{
    const query = ` update agent set a_auth = 1 where agentList_ra_regno = ? and a_id = ?;
    `
    const [rows,fields] = await db.query(query,[regno,a_id]);

  } catch (err) {
    console.error(err);
  throw err;
}

};


