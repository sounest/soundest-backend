const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jashkania2@gmail.com",
    pass: "zhth btom zdlm fvdy",
  },
});

module.exports = { transporter };
