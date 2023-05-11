const sql = require("../config/db");

let residentModel = {
  getReviewById: async (id, result) => {
    try {
      const res = await sql.query(
        `SELECT  rv_id, cmp_nm, address, agentList_ra_regno, rating, content, created_time 
          FROM review
          INNER JOIN agentlist
          ON agentlist.ra_regno = agentlist_ra_regno
          WHERE resident_r_id = ?`,
        [id]
      );
      result(res);
    } catch (error) {
      result(null, res);
    }
  },
  getOpenedReviewById: async (id, result) => {
    try {
      const res = await sql.query(
        `SELECT review_rv_id as rv_id, cmp_nm, address, agentList_ra_regno, rating, content, opened_review.created_time AS created_time 
          FROM opened_review 
          INNER JOIN review 
          ON opened_review.review_rv_id = review.rv_id 
          INNER JOIN agentList
          ON agentList_ra_regno=agentlist.ra_regno
          WHERE opened_review.resident_r_id = ? `,
        [id]
      );
      result(res);
    } catch (error) {
      result(null, res);
    }
  },
  getBookMarkById: async (id, result) => {
    try {
      const res = await sql.query(
        `SELECT bm_id, agentList_ra_regno, cmp_nm, address 
          FROM bookmark 
          INNER JOIN agentlist 
          ON agentList_ra_regno = ra_regno 
          WHERE resident_r_id = ? `,
        [id]
      );
      result(res);
    } catch (error) {
      result(null, res);
    }
  },
  getResidentById: async (id, result) => {
    try {
      const res = await sql.query("SELECT * FROM resident WHERE r_id = ?", [
        id,
      ]);
      result(res);
    } catch (error) {
      result(null, res);
    }
  },
};

module.exports = residentModel;
