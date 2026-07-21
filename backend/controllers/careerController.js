const fs = require("fs");
const transporter = require("../config/mailer"); // Same transporter used in Contact
const submitCareer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      qualification,
      subjects,
      address,
      message
    } = req.body;
    const resume = req.file;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "📄 New Career Application",
      html: `
        <h2>📄 New Career Application</h2>

        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Qualification:</strong> ${qualification}</p>
        <p><strong>Subjects:</strong> ${subjects}</p>
        <p><strong>Address:</strong> ${address}</p>

        <hr>

        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      attachments: [
        {
          filename: resume.originalname,
          path: resume.path
        }
      ]
    });
    if (resume) {
      fs.unlink(resume.path, (err) => {
        if (err) console.error("Failed to delete resume:", err);
      });
    }
    res.status(200).json({
      success: true,
      message: "Application submitted successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong."
    });
  }
};
module.exports = { submitCareer };