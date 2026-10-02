const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (password.length < 8)
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail }))
      return res.status(409).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword, role: "user" });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to create account" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to login" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to fetch user" });
  }
};

module.exports = { signup, login, getMe };
