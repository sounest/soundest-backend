const { transporter } = require("./Email.config");
const generateEmailTemplate = require("../utils/emailTemplate");

const Sendverificationcode = async (email, verificationCode) => {
  try {
    const htmlContent = generateEmailTemplate(verificationCode);
    await transporter.sendMail({
      from: '"Soundest Music" <jashkania2@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Verification email sending failed:", error);
  }
};

const welcomeEmail = async (email, username) => {
  try {
    const htmlContent = `<div style="font-family: Arial; padding: 20px;">
    <img src="1000081518-removebg-preview.png" alt="Soundest logo" width="400" height="300">
      <h2>Welcome to Soundest, ${username}!</h2>
      <p>Your email has been successfully verified.</p>
    </div>`;

    await transporter.sendMail({
      from: '"Soundest" <jashkania2@gmail.com>',
      to: email,
      subject: "🎉 Welcome to Soundest!",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Welcome email sending failed:", error);
  }
};

const reSendverificationcode = Sendverificationcode; 

module.exports = { Sendverificationcode, welcomeEmail, reSendverificationcode };