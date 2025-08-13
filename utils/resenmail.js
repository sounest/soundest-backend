const Resend = require("resend");
const { sendVerificationCode } = require("../middlewares/email");

const resendInstance = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, code, useResend = false }) => {
  if (useResend) {
    await resendInstance.emails.send({
      from: "Soundest <no-reply@soundest.com>",
      to,
      subject: "Your verification code",
      html: generateEmailTemplate(code),
    });
  } else {
    await sendVerificationCode(to, code);
  }
};

module.exports = sendMail;
