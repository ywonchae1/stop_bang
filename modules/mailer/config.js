require("dotenv").config();

const config = {
  user: process.env.MAILER_ID ?? "subinuhm1129",
  password: process.env.MAILER_PW ?? "deyjvajsrivuxelp",
  host: process.env.MAILER_HOST ?? "smtp.gmail.com",
  port: process.env.MAILER_PORT ?? "465",
};

module.exports = config;
