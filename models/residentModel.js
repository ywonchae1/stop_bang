const sql = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let residentModel = {
  getUserByUsername: async (username, result) => {
    try {
      const res = await sql.query(
        `SELECT r_username FROM resident WHERE r_username = ?`,
        `SELECT a_username FROM agent WHERE a_username = ?`,
        [username]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },

  getReviewById: async (id, result) => {
    try {
      const res = await sql.query(
        `SELECT  rv_id, cmp_nm, address, agentList_ra_regno, rating, content, tags, created_time 
          FROM review
          INNER JOIN agentList
          ON agentList.ra_regno = agentList_ra_regno
          WHERE resident_r_id = ?`,
        [id]
      );
      result(res);
    } catch (error) {
      result(null, error);
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
          ON agentList_ra_regno=agentList.ra_regno
          WHERE opened_review.resident_r_id = ? `,
        [id]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  getBookMarkById: async (id, result) => {
    try {
      const res = await sql.query(
        `SELECT bm_id, agentList_ra_regno, cmp_nm, address 
          FROM bookmark 
          INNER JOIN agentList 
          ON agentList_ra_regno = ra_regno 
          WHERE resident_r_id = ? `,
        [id]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  deleteBookMarkById: async (b_id, result) => {
    try {
      const res = await sql.query(`DELETE FROM bookmark WHERE bm_id = ?`, [
        b_id,
      ]);
      result(res);
    } catch (error) {
      console.error(error);
      result(null, error);
    }
  },
  getResidentById: async (id, result) => {
    try {
      const res = await sql.query("SELECT * FROM resident WHERE r_id = ?", [
        id,
      ]);
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  updateResident: async (id, body, result) => {
    try {
      const res = await sql.query(
        `UPDATE resident SET r_phone=?, r_email=?, r_birth=? 
      WHERE r_id=?`,
        [body.phone, body.email, body.birth, id]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  updateResidentPassword: async (id, body, result) => {
    try {
      const passwordHash = bcrypt.hash(body.password, saltRounds);
      const passwordResult = await sql.query(
        `SELECT r_password FROM resident WHERE r_id=?`,
        [id]
      );
      const password = passwordResult[0][0].r_password;

      if (body.oldpassword !== password) {
        result(null, "pwerror");
      } else {
        const res = await sql.query(
          `UPDATE resident SET r_password=? WHERE r_id=?`,
          [passwordHash, id]
        );
        result(res);
      }
    } catch (error) {
      result(null, error);
    }
  },
};

module.exports = residentModel;
