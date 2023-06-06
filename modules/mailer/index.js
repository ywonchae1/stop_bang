const nodemailer = require("nodemailer");
const config = require("./config");

const user = config.user;

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  auth: {
    user: config.user,
    pass: config.password,
  },
});

/**
 * 이메일 발송 메소드
 * @param {string} email
 * @param {string} code
 * @returns
 */
exports.sendEmail = (email, code) => {
  return new Promise((resolve, reject) => {
    const subject = "안녕하세요 멈춰방 입니다.";
    const body = `
        <div>
            <div>
                인증 코드입니다.
            </div>
            <div>
                ${code}
            </div>
        </div>
    `;
    transporter.sendMail(
      {
        from: user,
        to: email,
        subject,
        html: body,
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};
