const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const pool = require("../config/db");
const fetch = require("node-fetch");
require("dotenv").config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// ✅ REGISTER USER
const register = async (req, res) => {
    const { username, phone, email, password, gender, location } = req.body;

    if (!username || !phone || !email || !password || !gender || !location) {
        return res.redirect("/register?err=All fields are required");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.registerUser(username, phone, email, hashedPassword, gender, location);
        res.redirect("/login?success=Registration successful");
    } catch (error) {
        console.error("Registration error:", error);
        res.redirect("/register?err=Registration failed");
    }
};

// ✅ LOGIN USER
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render("login", { error: "❌ Please fill in all fields" });
        }

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.render("login", { error: "⚠️ User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: "🔑 Incorrect password" });
        }

        req.session.user = user; // Store user session
        return res.redirect("/stress/questionnaire");
    } catch (error) {
        console.error("❌ Login error:", error);
        res.render("login", { error: "🚨 Internal Server Error" });
    }
};

// ✅ LOGOUT USER
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.redirect("/index?error=Logout failed");
        }
        res.redirect("/login?success=Logged out successfully");
    });
};

// ✅ SEND OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const connection = await pool.getConnection();
        await connection.execute("DELETE FROM otps WHERE email = ?", [email]);
        await connection.execute("INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)", [email, otp, expiresAt]);
        connection.release();

        console.log("Generated OTP:", otp);

        const url = "https://send-bulk-emails.p.rapidapi.com/api/send/otp/mail";
        const options = {
            method: "POST",
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": "send-bulk-emails.p.rapidapi.com",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject: "Account OTP",
                from: "admin@gmail.com",
                to: email,
                senders_name: "WanderMind",
                body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
            }),
        };

        const response = await fetch(url, options);
        const responseData = await response.json();
        console.log("Email API Response:", responseData);

        if (response.ok) {
            return res.json({ success: true, redirect: `/reset-password?email=${encodeURIComponent(email)}` });
        } else {
            return res.status(500).json({ message: "Failed to send OTP via email" });
        }
    } catch (err) {
        console.error("Send OTP Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ VERIFY OTP & RESET PASSWORD
const verifyOTP = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const connection = await pool.getConnection();
        const [otpRecord] = await connection.execute("SELECT * FROM otps WHERE email = ? AND otp = ?", [email, otp]);

        if (!otpRecord.length || new Date(otpRecord[0].expires_at) < new Date()) {
            connection.release();
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
        await connection.execute("DELETE FROM otps WHERE email = ?", [email]);

        connection.release();

        res.json({ success: true, redirect: "/login?success=Password updated successfully!" });
    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ RESET PASSWORD WITHOUT OTP
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (!users.length) {
            connection.release();
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
        connection.release();

        res.json({ success: true, redirect: "/login?success=Password reset successfully!" });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ EXPORT MODULES
module.exports = {
    register,
    login,
    logout,
    sendOTP,
    verifyOTP,
    resetPassword,
};
