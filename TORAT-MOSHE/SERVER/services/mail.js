const nodemailer = require('nodemailer');

// https://support.google.com/mail/answer/185833?hl=iw


// console.log(process.env.pnpass);
// var transporter = nodemailer.createTransport({
//   service: 'Outlock',
//   auth: {
//     user: '36325304103@mby.co.il',
//     pass: 'Student@264'
//   }
// });

// var mailOptions = {
//   from: '36325304103@mby.co.il',
//   to: '36214385437@mby.co.il, 36325304103@mby.co.il, tamar6021@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!',
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


/////////////////////
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
      user: '36325304103@mby.co.il',
      pass: 'Student@264'
  }
});

function sendEmail(to, subject, body) {
  const mailOptions = {
      from: ' Torat Moshee 📜 <36325304103@mby.co.il>',
      to: to,
      subject: subject,
      text: body
  };
  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmail
};
