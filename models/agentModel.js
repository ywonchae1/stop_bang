//db정보받기
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  getAgentProfile: async (ra_regno) => {
    try {
    const res = await db.query(`
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

  getEnteredAgent: async (ra_regno) => {
    try {
      const res = await db.query(
      `
			SELECT a_office_hours, contact_number, telno, ra_regno
			FROM agent_contact
			RIGHT OUTER JOIN agentList
			ON agent_contact.agent_agentList_ra_regno = agentList.ra_regno
			LEFT OUTER JOIN agent
			ON agentList.ra_regno = agent.agentList_ra_regno
			WHERE ra_regno = ?;`,
			[ra_regno]
			);
			return res
		} catch (error) {
			return error
		}
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
    } catch(err) {
      return err
    }
  },

	//신고된 후기는 별점 반영X
	getRating: async (ra_regno) => {
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
		let res = await db.query(rawQuery, [ra_regno, ra_regno]);
		return res[0][0].agentRating;
  },

	getReport: async (ra_regno, a_id) => {
		let rawQuery = `
		SELECT repo_rv_id
		FROM review
		JOIN (
		SELECT *
		FROM report
		JOIN agent
		ON reporter=a_username
		) newTable
		ON rv_id=repo_rv_id
		WHERE newTable.agentList_ra_regno=? AND a_id=?;`
		let res = await db.query(rawQuery, [ra_regno, a_id]);
		return res[0];
	},

	reportProcess: async (req, a_id) => {
		let rawQuery = `
		INSERT
		INTO report(reporter, repo_rv_id, reportee, reason) 
		VALUES(?, ?, ?, ?)`
		let getReportee = `
		SELECT r_username
		FROM review
		JOIN resident
		ON resident_r_id=r_id
		WHERE rv_id=?`
		let getReporter = `
		SELECT a_username
		FROM agent
		WHERE a_id=?`
		let getRaRegno = `
		SELECT agentList_ra_regno
		FROM review
		WHERE rv_id=?`
		
		let reporter = await db.query(getReporter, [a_id]);
		let reportee = await db.query(getReportee, [req.params.rv_id]);
		await db.query(rawQuery, [reporter[0][0].a_username, req.params.rv_id, reportee[0][0].r_username, req.query.reason]);
		return await db.query(getRaRegno, [req.params.rv_id]);
	},

  updateMainInfo: async (params, body, result) => {
    try {
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
    } catch (error) {
      result(null, "imageError");
    }
  },

  getUnEnteredAgent: async (id, result) => {
    try {
      const res = await db.query("SELECT * FROM agentList WHERE ra_regno = ?", [
        id,
      ]);
      result(res);
    } catch (error) {
      result(null, error);
    }
  },

  updateEnterdAgentInfo: async (params, body, result) => {
    let rawQuery = `
		UPDATE agent_contact As contact, agentList As List, agent
		SET agent.a_profile_image=?, contact.contact_number=?, List.telno=? WHERE agentList_ra_regno=?`;
    let res = await db.query(rawQuery, [
      body.a_profile_image,
      body.contact_number,
      body.telno,
      params.agentList_ra_regno,
    ]);
    result(res);
  },

  /*
	updateUnEnterdAgentInfo: async (params, body, result) => {
		let rawQuery = `
		UPDATE agentList
		SET telno=? WHERE agentList_ra_regno=?`;
		let res = await db.query(rawQuery, [body.telno, params.agentList_ra_regno]);
		result(res);
	},
	*/

  getAgentByUsername: async (username, result) => {
    try {
      let rawQuery = `SELECT a_username FROM agent WHERE a_username = ?`;
      const res = await db.query(rawQuery, [username]);
      result(res);
    } catch (error) {
      console.log("🚀 ~ error:", error);
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
