const fs = require("fs");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
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
    const fs = require("fs");
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["eazylearning2026@gmail.com"],
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
          content: fs.readFileSync(resume.path),
        },
      ],
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
    console.error("CAREER ERROR:");
    console.error(error);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong."
    });
  }
};
module.exports = { submitCareer };