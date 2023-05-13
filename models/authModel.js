//db정보받기
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  registerResident: async (params, result) => {
    try {
      // 비밀번호 암호화해서 db에 저장하기
      const passwordHash = await bcrypt.hash(params.password, saltRounds);

      // 새로운 사용자 생성하기
      let rawQuery = `
    INSERT INTO resident (r_username, r_password, r_phone, r_realname, r_email, r_birth) 
    VALUES (?, ?, ?, ?, ?, ?);
    `;
      await db.query(rawQuery, [
        params.username,
        passwordHash,
        params.phone,
        params.realname,
        params.email,
        params.birth,
      ]);

      // 새로 생성된 사용자 id 가져오기
      const q = `
        SELECT r_id FROM resident WHERE r_username = ?;
        `;
      let res2 = await db.query(q, [params.username]);

      return result(res2[0][0].r_id);
    } catch (err) {
      console.error("🚀 ~ err:", err);
      return result(null);
    }
  },

  registerAgent: async (params, result) => {
    try {
      // 비밀번호 암호화해서 db에 저장하기
      const passwordHash = await bcrypt.hash(params.password, saltRounds);

      // 새로운 공인중개사 생성하기
      let rawQuery = `
    INSERT INTO agent (agentList_ra_regno, a_username, a_password, a_realname, a_email, a_image1, a_image2, a_image3) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
      await db.query(rawQuery, [
        params.agentList_ra_regno,
        params.username,
        passwordHash,
        params.realname,
        params.email,
        params.image1,
        params.image2,
        params.image3,
      ]);

      // 새로 생성된 공인중개사의 id 가져오기
      const q = `
        SELECT a_id FROM agent WHERE a_username = ?;
        `;
      let res2 = await db.query(q, [params.username]);

      return result(res2[0][0].a_id);
    } catch (err) {
      console.error("🚀 ~ err:", err);
      return result(null);
    }
  },

  getUser: async (params, result) => {
    let res;
    let isAgent = false;

    // DB에서 해당하는 사용자 정보 가져오기
    let rawQuery = `
    SELECT r_id, r_password FROM resident WHERE r_username = ?;
    `;
    res = await db.query(rawQuery, [params.username]);

    // 사용자가 아니라면 DB에서 해당하는 공인중개사 정보 가져오기
    if (res[0].length === 0) {
      let rawQuery2 = `
        SELECT a_id, a_password FROM agent WHERE a_username = ?;
        `;
      res = await db.query(rawQuery2, [params.username]);
      if (res[0].length === 0) return result(null);

      isAgent = true;
    }

    // 사용자/공인중개사 비밀번호 유효성 확인하기
    const passwordHash = isAgent ? res[0][0].a_password : res[0][0].r_password;
    const res2 = bcrypt.compare(params.password, passwordHash);
    if (!res2) return result(null);

    result(isAgent ? res[0][0].a_id : res[0][0].r_id);
  },
};
