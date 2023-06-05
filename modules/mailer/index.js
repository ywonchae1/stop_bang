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

/*
    .env 설정
        1. env로 설정할 이메일로 로그인 한다.
        2. 구글 계정 관리 페이지로 접속한다.
        3. 2단계 인증이 되어있지 않으면 2단계 인증을 설정한다.
        4. 2단계 인증 활성화 중 '앱 비밀번호' 를 활성화 한다.
        5. .env 파일에서 MAILER_PW의 값을 앱 비밀번호 값으로 설정한다. deyjvajsrivuxelp

      - .env 파일 설정 예시
        MAILER_ID="이메일 계정 ID"
        MAILER_PW="앱 비밀번호"
        MAILER_HOST="smtp.gmail.com"
        CERTIFICATION_EMAIL="이메일 계정 ID"

    ** gmail smtp 설정이 제일 간단하기 때문에 gmail로 설정을 추천드립니다.
 */
