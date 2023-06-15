//db정보받기
const db = require("../config/db.js");

module.exports = {
  //입주민 회원인지 공인중개사 회원인지 확인
  whoAreYou: async (r_username) => {
    try {
      let rawQuery = `
      SELECT r_id
      FROM resident
      WHERE r_username=?;`;
      let who = await db.query(rawQuery, [r_username]);
      if(who[0][0] == null) return 0;
      else return 1;
    } catch (error) {
      return error;
    }
  },

  //공인중개사의 프로필 가져오기
  getRealtorProfile: async (ra_regno) => {
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

  //부동산의 사진, 소개글 가져오기
  getMainInfo: async (ra_regno) => {
    let rawQuery = `
		SELECT ra_regno, a_image1, a_image2, a_image3, a_introduction
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
      return res;
    } catch (error) {
      return error;
    }
  },

  //부동산 페이지에 방문한 입주민이 해당 부동산을 북마크 했는지 확인
  getBookmarkByIdnRegno: async (ra_regno, r_username) => {
    try {
      const res = await db.query(
        `SELECT * FROM bookmark JOIN resident ON resident_r_id=r_id WHERE agentList_ra_regno=? AND r_username=?`,
        [ra_regno, r_username]
      );
      return res;
    } catch (error) {
      return error;
    }
  },

  getReviewByRaRegno: async (ra_regno, r_username) => {
    try {
      //입주민 회원이 작성한 후기 평균을 가져오느라 조인 많이~
      //7회 이상 신고된 후기는 case when절로 확인
      //check_repo 값이 0인 후기는 나쁜 후기로,
      //🚨신고가 7회 누적되어 더이상 접근할 수 없는 후기입니다.🚨 표시
      let rawQuery = `
      SELECT cmp_nm, ra_regno, rv_id, r_id, r_username, rating, content, tags, avgRRating, DATE_FORMAT(newTable.created_time,'%Y-%m-%d') AS created_time,
      CASE
      WHEN rv_id IN (
      SELECT repo_rv_id
      FROM report
      GROUP BY repo_rv_id
      HAVING COUNT(repo_rv_id) >= 7)
      THEN 0
      ELSE 1
      END AS check_repo
      FROM agentList
      JOIN(
      SELECT rv_id, r_id, r_username, agentList_ra_regno, rating, tags, content, avgRRating, newTable3.created_time AS created_time
      FROM resident
      RIGHT JOIN (
      SELECT *
      FROM review
      LEFT OUTER JOIN (
      SELECT resident_r_id AS review_r_id, TRUNCATE(AVG(rating), 1) AS avgRRating
      FROM review
      GROUP BY resident_r_id
      ) newTable2
      ON resident_r_id=review_r_id
      ) newTable3
      ON r_id=resident_r_id
      ) newTable
      ON agentList_ra_regno=ra_regno
      WHERE ra_regno=?`;

      let reviews = await db.query(rawQuery, [ra_regno]);
      return reviews[0];
    } catch (err) {
      return err;
    }
  },

  getOpenedReview: async (r_username) => {
    try {  
      let checkOpenedRawQuery = `
      SELECT review_rv_id
      FROM opened_review
      JOIN resident
      ON resident_r_id=r_id
      WHERE r_username=?`;

      let opened = await db.query(checkOpenedRawQuery, [r_username]);
      return opened[0];
    } catch (err) {
      return err;
    }
  },

  canIOpen: async (r_username) => {
    try {
      let checkRPointRawQuery = `
			SELECT r_point
			FROM resident
			WHERE r_username=?`;

      let rPoint = await db.query(checkRPointRawQuery, [r_username]);
      let canOpen = 1;
      if (rPoint[0][0].r_point < 2) canOpen = 0;
      return canOpen;
    } catch(err) {
      return err;
    }
  },

  //페이지에 방문한 resident 회원이 신고한 후기라면 🚔신고완료 표시를 위해 resident 테이블과 reporter(신고자)에 대해 JOIN
  //agent는 다른 부동산의 후기를 신고할 수 없으므로 이 경우 고려할 필요 없음
  getReport: async (params, r_username) => {
    let rawQuery = `
		SELECT repo_rv_id, r_username, r_id, agentList_ra_regno
		FROM review
		JOIN (
		SELECT repo_rv_id, r_id, r_username
		FROM report
		JOIN resident
		ON reporter=r_username
    WHERE r_username=?
		) newTable
		ON rv_id=repo_rv_id
		WHERE agentList_ra_regno=?`;
    let res = await db.query(rawQuery, [r_username, params.ra_regno]);
    return res[0];
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

  insertOpenedReview: async (r_username, rv_id, result) => {
    let getRIdRawQuery = `
    SELECT r_id
    FROM resident
    WHERE r_username=?`
    let insertRawQuery = `
		INSERT
		INTO opened_review(resident_r_id, review_rv_id)
		VALUE(?, ?);
		`;
    let usePointRawQuery = `
		UPDATE resident
		SET r_point=r_point - 2
		WHERE r_username=?;
		`;
    getRId = await db.query(getRIdRawQuery, [r_username]);
    console.log(getRId[0][0].r_id);
    await db.query(insertRawQuery, [getRId[0][0].r_id, rv_id]);
    await db.query(usePointRawQuery, [r_username]);
    result();
  },

  reportProcess: async (req, r_username) => {
    let rawQuery = `
		INSERT
		INTO report(reporter, repo_rv_id, reportee, reason) 
		VALUES(?, ?, ?, ?)`;
    let getReportee = `
		SELECT r_username
		FROM review
		JOIN resident
		ON resident_r_id=r_id
		WHERE rv_id=?`;
    let getRaRegno = `
		SELECT agentList_ra_regno
		FROM review
		WHERE rv_id=?`;

    let reportee = await db.query(getReportee, [req.params.rv_id]);
    await db.query(rawQuery, [
      r_username,
      req.params.rv_id,
      reportee[0][0].r_username,
      req.query.reason,
    ]);
    return await db.query(getRaRegno, [req.params.rv_id]);
  },

  updateBookmark: async (r_username, body, result) => {
    let getRIdRawQuery = `
    SELECT r_id
    FROM resident
    WHERE r_username=?`;
    let res;

    try {
      if (body.isBookmark !== "0") {
        rawQuery = `DELETE FROM bookmark WHERE bm_id=?`;
        res = await db.query(rawQuery, [body.isBookmark]);
      } else {
        insertRawQuery = `INSERT INTO bookmark (resident_r_id, agentList_ra_regno) values (?, ?)`;
        r_username = await db.query(getRIdRawQuery, [r_username]);
        res = await db.query(insertRawQuery, [r_username[0][0].r_id, body.raRegno]);
      }
      result(res);
    } catch (error) {
      result(null, error);
    }
  },
};
