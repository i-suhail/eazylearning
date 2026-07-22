require("dotenv").config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const path = require("path");
const express = require("express");
const pool = require("./config/db");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const careerRoutes = require("./routes/careerRoutes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/api/admin", adminRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api/career", careerRoutes);
const PORT = process.env.PORT || 5000;
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
          phone,
          email,
          message
        } = req.body;
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "eazylearning2026@gmail.com", // Your receiving email
            subject: "📩 New Contact Form Submission",
            html: `
            <h2>📩 New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
            <p><strong>Email:</strong> ${email || "Not Provided"}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            `,
        });
        res.json({
            success: true,
            message: "Message sent successfully!"
        });
    }catch (err) {
        console.error("CONTACT ERROR:");
        console.error(err);
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});