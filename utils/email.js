// const nodemailer = require("nodemailer");
// const pug = require("pug");
// const htmlToText = require("html-to-text");
// const dotenv = require("dotenv");
// // dotenv.config({ path: ".//.env" });

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(" ")[0];
//     this.url = url;
//     this.from = `Hospital Admin <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     // if (process.env.NODE_ENV === "production") {
//     //   return nodemailer.createTransport({
//     //     service: "SendGrid",
//     //     auth: {
//     //       user: process.env.SENDGRID_USERNAME,
//     //       pass: process.env.SENDGRID_PASSWORD,
//     //     },
//     //   });
//     // }

//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }

//   async send(template, subject) {
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//     });

//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html),
//     };

//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendPasswordReset() {
//     await this.send(
//       "passwordReset",
//       "Your password reset token (valid for 10 min)"
//     );
//   }
// };

// /* eslint-disable import/no-extraneous-dependencies */
// const nodemailer = require("nodemailer");
// // eslint-disable-next-line import/newline-after-import
// const dotenv = require("dotenv");
// dotenv.config();
// //  service that send emails, such as Gmail , SendGrid , mailgun , mailtrap
// //  create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// module.exports = {
//   sendEmail: async (to, resetCode) => {
//     const mailOptions = {
//       from: `Hospital App  ${process.env.EMAIL_HOST}`, // sender address
//       to: to.email, // list of receivers
//       subject: `Reset Your Password!`, // Subject line
//       text: `
//       Dear ${to.name}
//       You are receiving this email because we received a password reset request for your account
//       <a href="${resetUrl}/${resetToken}">Reset Password</a>
//       Best regards,
//       ${to.name}`, // plain text body
//     };
//     try {
//       await transporter.sendMail(mailOptions);
//       // console.log("Message sent: successfully");
//       return true;
//     } catch (err) {
//       // console.error(`Error sending Email : ${err.message}`);
//       return false;
//     }
//   },
// };

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  sendEmail: async (to, resetCode) => {
    const mailOptions = {
      from: `"Hospital System" <${process.env.EMAIL_USERNAME}>`,
      to: to.email,
      subject: "Reset Your Password!",
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #007BFF;">Hello ${to.name},</h2>

    <p>
      We received a request to reset your password for your <strong>Hospital System</strong> account.
    </p>

    <p>
      Please use the following verification code to reset your password:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <strong style="font-size: 28px; letter-spacing: 4px; color: #007BFF;">${resetCode}</strong>
    </div>

    <p>
      This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email. No changes will be made to your account.
    </p>

    <p>
      Best regards,<br>
      <strong>Hospital System Team</strong>
    </p>
  </div>

      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error(`Error sending email: ${err.message}`);
      return false;
    }
  },
};
