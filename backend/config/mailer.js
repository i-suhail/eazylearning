const dns = require("dns");
const nodemailer = require("nodemailer");
dns.setDefaultResultOrder("ipv4first");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
module.exports = transporter;