//db정보받기
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  getAgentProfile: async (ra_regno) => {
    try {
      const res = await db.query(
        `
			SELECT agentList.rdealer_nm, agentList.cmp_nm, agentList.address, agent.a_profile_image
			FROM agentList
			LEFT JOIN agent ON agentList.ra_regno = agent.agentList_ra_regno
			WHERE agentList.ra_regno = ?;`,
        [ra_regno]
      );
      return res[0];
    } catch (error) {
      return error;
    }
  },

  getMainInfo: async (ra_regno) => {
    let rawQuery = `
		SELECT a_id, ra_regno, a_image1, a_image2, a_image3, a_introduction
		FROM agent
		RIGHT OUTER JOIN agentList
		ON agentList_ra_regno=ra_regno
		WHERE ra_regno = ?;`;
    let res = await db.query(rawQuery, [ra_regno]);
    return res[0][0];
  },

  getReviewByRaRegno: async (ra_regno, r_id) => {
    try {
      let rawQuery = `
			SELECT cmp_nm, ra_regno, rv_id, r_id, r_username, rating, content, tags, DATE_FORMAT(newTable.created_time,'%Y-%m-%d') AS created_time
			FROM agentList
			JOIN(
			SELECT rv_id, r_id, r_username, agentList_ra_regno, rating, tags, content, review.created_time AS created_time
			FROM resident
			JOIN review
			ON r_id=resident_r_id
			) newTable
			ON agentList_ra_regno=ra_regno
			WHERE ra_regno=?;`;
      let res = await db.query(rawQuery, [ra_regno]);
      return res[0];
    } catch (err) {
      return err;
    }
  },

  //신고된 후기는 별점 반영X
  getRating: async (params) => {
    let rawQuery = `
		SELECT TRUNCATE(AVG(rating), 1) AS agentRating
		FROM review
		RIGHT OUTER JOIN agentList
		ON agentList_ra_regno=ra_regno
		WHERE ra_regno=? AND rv_id NOT IN (
			SELECT rv_id
			FROM (
			SELECT rv_id, COUNT(rv_id) AS cnt, agentList_ra_regno
			FROM report
			JOIN review
			ON repo_rv_id=rv_id
			WHERE agentList_ra_regno=?
			GROUP BY rv_id
			HAVING cnt >= 7) newTable
		);`;
    let res = await db.query(rawQuery, [params.ra_regno, params.ra_regno]);
    return res[0][0].agentRating;
  },

  getReport: async (ra_regno, r_id) => {
    let rawQuery = `
		SELECT repo_rv_id
		FROM review
		JOIN (
		SELECT *
		FROM report
		JOIN resident
		ON reporter=r_username
		) newTable
		ON rv_id=repo_rv_id
		WHERE agentList_ra_regno=? AND r_id=?;`;
    let res = await db.query(rawQuery, [ra_regno, r_id]);
    return res[0];
  },

  updateMainInfo: async (params, body, result) => {
    let rawQuery = `
      UPDATE agent
      SET a_image1=?, a_image2=?, a_image3=?, a_introduction=? WHERE agentList_ra_regno=?`;
    let res = await db.query(rawQuery, [
      body.image1,
      body.image2,
      body.image3,
      body.a_introduction,
      params.agentList_ra_regno,
    ]);
    result(res);
  },

  updateMainInfo: async (ra_regno, body, result) => {
    let rawQuery = `
		UPDATE agent
		SET a_image1=?, a_image2=?, a_image3=?, a_introduction=? WHERE agentList_ra_regno=?`;
    let res = await db.query(rawQuery, [
      body.image1,
      body.image2,
      body.image3,
      body.a_introduction,
      ra_regno.agentList_ra_regno,
    ]);
    result(res);
  },

  getEnteredAgent: async (ra_regno) => {
    try {
      const res = await db.query(
        `SELECT a_office_hours, contact_number, telno, ra_regno
			FROM agentList
			LEFT JOIN agent_contact
			ON agentList.ra_regno=agent_contact.agent_agentList_ra_regno
			LEFT JOIN agent
			ON agentList.ra_regno=agent.agentList_ra_regno
			WHERE agentList_ra_regno=?`,
        [ra_regno]
      );
      return res;
    } catch (error) {
      console.error(error);
      //   result(null, error);
    }
  },

  getUnEnteredAgent: async (ra_regno, result) => {
    try {
      const res = await db.query("SELECT * FROM agentList WHERE ra_regno = ?", [
        ra_regno,
      ]);
      result(res);
    } catch (error) {
      result(null, error);
    }
  },

  updateEnterdAgentInfo: async (ra_regno, body, result) => {
    try {
      console.log(body);
      const res = await db.query(
        `UPDATE agent SET a_profile_image=?, a_office_hours=? 
			WHERE agentList_ra_regno=?`,
        [body.profileImage, body.officeHour, ra_regno]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },

  getAgentById: async (decoded, result) => {
    try {
      let rawQuery = `
      SELECT *
      FROM agent
      RIGHT OUTER JOIN agentList
      ON ra_regno=agentList_ra_regno
      WHERE a_id=?;`;
      const res = await db.query(rawQuery, [decoded.userId]);
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  updateAgent: async (id, body, result) => {
    try {
      const res = await db.query(
        `UPDATE agent SET a_email=? 
      WHERE a_id=?`,
        [body.email, id]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
  updateAgentPassword: async (id, body, result) => {
    try {
      console.log(body.password);
      const passwordHash = bcrypt.hash(body.password, saltRounds);
      // const passwordResult = await db.query(
      //   `SELECT a_password FROM agent WHERE a_id=?`,
      //   [id]
      // );
      // const password = passwordResult[0][0].a_password;

      // if (body.oldpassword !== password) {
      //   result(null, "pwerror");
      // } else {
      //왜안된담....
      const res = await db.query(
        "UPDATE agent SET a_password=aaa WHERE a_id = ?",
        [passwordHash, id]
      );
      console.log(res);
      result(res);
      // }
    } catch (error) {
      console.error(error);
      result(null, error);
    }
  },
};
