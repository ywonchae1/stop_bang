require("dotenv").config();

const config = {
    user: process.env.MAILER_ID,
    password: process.env.MAILER_PW,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
};

module.exports = config;