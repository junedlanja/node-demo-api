const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
const config = require('../config/config');
const logger = require('../config/logger');

let BASE_PATH = __dirname.split('/');
BASE_PATH.splice(-1, 1);
BASE_PATH = BASE_PATH.join('/');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, body) => {
  const subject = 'Reset password';
  const html = fs.readFileSync(path.join(BASE_PATH, "/public/template/ResetPassword.html"), { encoding: "utf-8" });
  const url = `http://${process.env.HOST}/v1/reset-password?token=${body.token}`;
  const template = handlebars.compile(html);
  const htmlToSend = template({
    name: body.name,
    email: body.email,
    url
  });
  await sendEmail(to, subject, htmlToSend);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
};
