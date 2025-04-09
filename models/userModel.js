const db = require("../config/db.js");

const userModel = {
    // ✅ Get user by email
    getUserByEmail: async (email) => {
        try {
            const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
            return results.length ? results[0] : null;
        } catch (error) {
            console.error("Database error:", error);
            throw error;
        }
    },

    // ✅ Register new user
    registerUser: async (username, phone, email, hashedPassword, gender, location) => {
        try {
            const query = "INSERT INTO users (username, phone, email, password, gender, location) VALUES (?, ?, ?, ?, ?, ?)";
            const [result] = await db.execute(query, [username, phone, email, hashedPassword, gender, location]);
            return result;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }
};

module.exports = userModel;
