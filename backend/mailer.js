const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"CivicForum" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🎉 Welcome to CivicForum!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; border-radius: 10px; padding: 40px; text-align: center;">
          <h1 style="color: #667eea;">🏛️ Welcome to CivicForum!</h1>
          <p style="font-size: 18px; color: #333;">Hey <strong>${userName}</strong>! 👋</p>
          <p style="color: #666; font-size: 16px;">
            We're thrilled to have you as part of our growing civic community!
          </p>
          <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="color: #444; font-size: 15px;">🗳️ <strong>Share your opinions</strong> on local issues</p>
            <p style="color: #444; font-size: 15px;">📢 <strong>Raise complaints</strong> to the right authorities</p>
            <p style="color: #444; font-size: 15px;">🤝 <strong>Connect</strong> with fellow citizens</p>
            <p style="color: #444; font-size: 15px;">📰 <strong>Stay updated</strong> with local news & polls</p>
          </div>
          <p style="color: #666;">Together, we can make our community a better place! 💪</p>
          <a href="http://localhost:8080" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 25px; font-size: 16px;">
            Visit CivicForum 🚀
          </a>
          <p style="margin-top: 30px; color: #999; font-size: 12px;">
            This email was sent by CivicForum. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };