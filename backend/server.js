require("dotenv").config();

const path = require("path");
const express = require("express");
const pool = require("./config/db");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const nodemailer = require("nodemailer");
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/api/admin", adminRoutes);
app.use("/api", enrollmentRoutes);

const PORT = process.env.PORT || 5000;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
app.get("/", (req, res) => {
    res.send("Easy Learning Backend Running 🚀");
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
  } else {
    console.log("✅ Neon PostgreSQL Connected");
    console.log("Server Time:", res.rows[0].now);
  }
});
app.post("/api/contact", async (req, res) => {
    try {
        const {
          name,
          email,
          message
        } = req.body;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "📩 New Contact Form Submission",
            html: `
            <h2>📩 New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || "Not Provided"}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            `
        });
        res.json({
            success: true,
            message: "Message sent successfully!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});