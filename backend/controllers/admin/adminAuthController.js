const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const Admin = require("../../models/adminLogin");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username !== ADMIN_USERNAME) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Change const to let so it can be reassigned
    let admin = await Admin.findOne({ username: ADMIN_USERNAME });

    if (!admin) {
      admin = new Admin({ username: ADMIN_USERNAME, passwordHash: ADMIN_PASSWORD_HASH });
      await admin.save();
    } 

    const jwtSecret = "secret";
    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during admin login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
