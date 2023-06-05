const sql = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let residentModel = {
  getUserByUsername: async (username, result) => {
    try {
      const res = await sql.query(
        `SELECT r_username FROM resident WHERE r_username = ?`,
        [username]
      );
      result(res);
    } catch (error) {
      console.log("🚀 ~ getUserByUsername error:", error);
      result(null, error);
    }
  },

  getReviewById: async (r_username, result) => {
    try {
      const res = await sql.query(`
        SELECT r_username, rv_id, cmp_nm, address, agentList_ra_regno, rating, content, tags, created_time 
        FROM agentList
        INNER JOIN (
        SELECT r_username, rv_id, agentList_ra_regno, rating, content, tags, review.created_time AS created_time
        FROM review
        JOIN resident
        ON resident_r_id=r_id
        ) newTable
        ON agentList.ra_regno = agentList_ra_regno
        WHERE r_username = ?`,
        [r_username]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  getOpenedReviewById: async (r_username, result) => {
    try {
      const res = await sql.query(`
      SELECT r_username, review_rv_id as rv_id, cmp_nm, address, agentList_ra_regno, rating, content, tags, opened_review.created_time AS created_time 
      FROM opened_review 
      INNER JOIN (
      SELECT r_username, rv_id, agentList_ra_regno, rating, content, tags, review.created_time AS created_time
      FROM review
      JOIN resident
      ON resident_r_id=r_id
      ) newTable
      ON opened_review.review_rv_id = newTable.rv_id 
      INNER JOIN agentList
      ON agentList_ra_regno=agentList.ra_regno
      WHERE r_username = ?`,
        [r_username]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  getBookMarkById: async (r_username, result) => {
    try {
      let getRIdRawQuery = `
      SELECT r_id
      FROM resident
      WHERE r_username=?`;
      id = await sql.query(getRIdRawQuery, [r_username]);
      const res = await sql.query(
        `SELECT bm_id, agentList_ra_regno, cmp_nm, address 
          FROM bookmark 
          INNER JOIN agentList 
          ON agentList_ra_regno = ra_regno 
          WHERE resident_r_id = ? `,
        [id[0][0].r_id]
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
  getResidentById: async (r_username, result) => {
    try {
      const res = await sql.query("SELECT * FROM resident WHERE r_username = ?", [
        r_username,
      ]);
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  updateResident: async (r_username, body, result) => {
    try {
      const res = await sql.query(
        `UPDATE resident SET r_phone=?, r_email=?, r_birth=? 
      WHERE r_username=?`,
        [body.phone, body.email, body.birth, r_username]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  updateResidentPassword: async (r_username, body, result) => {
    try {
      const passwordHash = bcrypt.hash(body.password, saltRounds);
      const passwordResult = await sql.query(
        `SELECT r_password FROM resident WHERE r_username=?`,
        [r_username]
      );
      const password = passwordResult[0][0].r_password;

      if (body.oldpassword !== password) {
        result(null, "pwerror");
      } else {
        const res = await sql.query(
          `UPDATE resident SET r_password=? WHERE r_username=?`,
          [passwordHash, r_username]
        );
        result(res);
      }
    } catch (error) {
      result(null, error);
    }
  },
};

module.exports = residentModel;
