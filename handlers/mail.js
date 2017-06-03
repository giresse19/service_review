const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');


const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html); // library for styling
  return inlined;
}


exports.send = async (options) => {
  const html = generateHTML(options.filename, options);  
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: ` Bob <noreply@bob.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};




// checking that our host and port for mailtrap works well
/*
transport.sendMail({
  from: 'wes bos <ashubobg@yahoo.co.uk>',
  to: 'randy@example.com',
  subject: 'just trying things out',
  html: 'hey i <strong>love<strong> you',
  text: 'hey i **love you**'
});
*/
