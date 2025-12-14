const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return res.json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = new Admin({ name, email, passwordHash });
  await admin.save();

  res.json({ message: "Admin created successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ message: "Login successful", token });
};
