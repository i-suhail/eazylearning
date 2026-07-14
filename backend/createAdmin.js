require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("./config/db");

async function createAdmin() {
  try {
    const password = await bcrypt.hash("admin123", 10);

    await pool.query(
      `
      INSERT INTO admins (name, email, password)
      VALUES ($1, $2, $3)
      `,
      [
        "Azeezunnisa Ahmed",
        "admin@eazylearning.com",
        password,
      ]
    );

    console.log("✅ Admin Created Successfully");

    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
}

createAdmin();