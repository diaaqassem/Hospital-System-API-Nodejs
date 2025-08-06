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
