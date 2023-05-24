//db정보받기
const db = require("../config/db.js");

module.exports = {
  getAgentProfile: async (ra_regno, result) => {
    try {
      const res = await db.query(
        `SELECT agentList.rdealer_nm, agentList.cmp_nm, agentList.address, agent.a_profile_image
				FROM agentList
				INNER JOIN agent ON agentList.ra_regno = agent.agentList_ra_regno
				WHERE agentList.ra_regno = ?;`,
        [ra_regno]
      );
      result(res);
    } catch (error) {
      result(null, error);
    }
  },

  /* getMainInfo: async (id, result) => {
		try {
			const res = await sql.query(
				`SELECT image1, image2, image3, a_introduction FROM agent
				WHERE agentList.ra_regno = ?;`,
				[id]
			);
			result(res);
		} catch (error) {
			result(null,error);
		}
	}, */

  getMainInfo: async (params, result) => {
    let agentId = params;
    let rawQuery = `SELECT a_image1, a_image2, a_image3, a_introduction FROM agent
				WHERE agentList_ra_regno = ?;`;
    let res = await db.query(rawQuery, [agentId]);
    result(res[0][0]);
  },

  getReviewByRaRegno: async (ra_regno, result) => {
    let rawQuery=`
    SELECT rv_id, r_username, A.rating AS rating, content, cmp_nm, ra_regno, DATE_FORMAT(A.created_time,'%Y-%m-%d') AS created_time 
    FROM agentList 
    JOIN(SELECT rv_id, r_username, agentList_ra_regno, rating, content, review.created_time AS created_time 
    FROM resident 
    JOIN review 
    ON r_id=resident_r_id) A 
    ON agentList_ra_regno=ra_regno WHERE ra_regno=?`;
    let res = await db.query(rawQuery, [ra_regno]);
    result(res[0]);
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

  getEnteredAgent: async (id, result) => {
    try {
      const res = await db.query(
        `SELECT a_office_hours, contact_number, telno, agentList_ra_regno
				FROM agent_contact
				JOIN agentList
				ON agent_contact.agent_agentList_ra_regno = agentList.ra_regno
				JOIN agent
				ON agentList.ra_regno = agent.agentList_ra_regno
				WHERE agentList_ra_regno = ?`,
        [id]
      );

      result(res);
    } catch (error) {
      result(null, error);
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
};
