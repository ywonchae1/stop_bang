//db정보받기
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    getAgentProfile: async (ra_regno, result) => {
	try {
	    const res = await db.query(
		`SELECT agentList.rdealer_nm, agentList.cmp_nm, agentList.address, agent.a_profile_image
				FROM agentList
				LEFT JOIN agent ON agentList.ra_regno = agent.agentList_ra_regno
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
			const res = await db.query(
				`SELECT image1, image2, image3, a_introduction FROM agent
				WHERE agentList.ra_regno = ?;`,
				[id]
			);
			result(res);
		} catch (error) {
			result(null,error);
		}
	}, */

    getMainInfo: async (ra_regno, result) => {
	let rawQuery = `SELECT a_image1, a_image2, a_image3, a_introduction FROM agent
				WHERE agentList_ra_regno = ?;`;
	let res = await db.query(rawQuery, [ra_regno]);
	result(res[0][0]);
    },

    getRating: async (ra_regno, result) => {
	let rawQuery = `
	SELECT TRUNCATE(AVG(rating), 1) AS agentRating
	FROM review
	WHERE agentList_ra_regno=?`
	let res = await db.query(rawQuery, [ra_regno]);
	result(res[0][0]);
    },

    getReviewByRaRegno: async (ra_regno, result) => {
	let rawQuery=`
    SELECT rv_id, r_username, A.rating AS rating, content, cmp_nm, ra_regno, DATE_FORMAT(A.created_time,'%Y-%m-%d') AS created_time 
    FROM agentList 
    LEFT JOIN(SELECT rv_id, r_username, agentList_ra_regno, rating, content, review.created_time AS created_time 
    FROM resident 
    LEFT JOIN review 
    ON r_id=resident_r_id) A 
    ON agentList_ra_regno=ra_regno WHERE ra_regno=?`;
	let res = await db.query(rawQuery, [ra_regno]);
	result(res[0]);
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

    getEnteredAgent: async (ra_regno, result) => {
	try {
	    const res = await db.query(
		`SELECT a_office_hours, contact_number, telno, agentList_ra_regno
				FROM agent_contact
				JOIN agentList
				ON agent_contact.agent_agentList_ra_regno = agentList.ra_regno
				JOIN agent
				ON agentList.ra_regno = agent.agentList_ra_regno
				WHERE agentList_ra_regno = ?`,
		[ra_regno]
	    );

	    result(res);
	} catch (error) {
	    result(null, error);
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

    /*
	updateUnEnterdAgentInfo: async (params, body, result) => {
		let rawQuery = `
		UPDATE agentList
		SET telno=? WHERE agentList_ra_regno=?`;
		let res = await db.query(rawQuery, [body.telno, params.agentList_ra_regno]);
		result(res);
	},
	*/
  getAgentById: async (id, result) => {
    try {
      const res = await db.query("SELECT * FROM agent WHERE a_id = ?", [id]);
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


	// let rawQuery = `
	// 	UPDATE agent
	// 	SET agent.a_profile_image=?, agent.a_office_hours=? WHERE agentList_ra_regno=?`;
	// let res = await db.query(rawQuery, [ra_regno,
	//     body.a_profile_image,
	// 	body.a_office_hours,
	//     //ra_regno.agentList_ra_regno,
	// ]);
	// result(res);