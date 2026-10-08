const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const createToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const getGoogleClient = () =>
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

const getClientUrl = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

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

const googleLogin = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL)
      return res.status(503).json({ success: false, message: "Google login is not configured" });

    const state = jwt.sign(
      { purpose: "google_oauth", nonce: randomBytes(16).toString("hex") },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const client = getGoogleClient();
    const url = client.generateAuthUrl({
      access_type: "online",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
      state,
    });

    return res.redirect(url);
  } catch {
    return res.status(500).json({ success: false, message: "Unable to start Google login" });
  }
};

const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.redirect(getClientUrl() + "/login?error=google_login_failed");

    jwt.verify(state, process.env.JWT_SECRET, { algorithms: ["HS256"] });

    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) throw new Error("Google did not return an ID token");

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || payload.email_verified !== true)
      throw new Error("Google account email is not verified");

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(randomBytes(32).toString("hex"), 12);
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email,
        password: randomPassword,
        role: "user",
      });
    }

    const token = createToken(user);
    return res.redirect(getClientUrl() + "/auth/callback?token=" + encodeURIComponent(token));
  } catch (error) {
    console.error("Google OAuth failed:", error.message);
    return res.redirect(getClientUrl() + "/login?error=google_login_failed");
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

module.exports = { signup, login, googleLogin, googleCallback, getMe };
