# BrainSync: AI-Powered Mindful Meditation Guide

## 🚀 Introduction  
**BrainSync** is an AI-powered meditation guide designed to **assess users' stress levels** and provide **personalized mindfulness practices**. The platform offers **morning, afternoon, and night meditation sessions** based on the user's stress level analysis. Built with **Node.js, Express, Tailwind CSS, and MySQL**, BrainSync ensures a seamless and user-friendly experience for stress management.

## 🎯 Features  
- **AI Stress Assessment** – Uses AI to analyze user responses and determine stress levels.
- **Personalized Meditation Sessions** – Morning, afternoon, and night sessions tailored to stress levels.
- **Custom Stress Solutions** – AI-powered recommendations for stress relief practices.
- **Feedback System** – Collects user feedback to improve recommendations.
- **Secure User Authentication** – Role-based access for users and admins.
- **Responsive UI** – Designed with **Tailwind CSS** for an intuitive experience.

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js  
- **Frontend:** Tailwind CSS, Alpine.js  
- **Database:** MySQL  
- **Authentication & Roles:** Csurf, Express Session  

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/yourusername/brainsync.git  
cd brainsync
```

### 2️⃣ Setup Database Credentials  
```js
const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'databasename',
  })
  .promise();

module.exports = db;
```

### 3️⃣ Setup Database  
```sh
-- Create the 'users' table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'questionnaire_responses' table
CREATE TABLE questionnaire_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    responses JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'mcq_responses' table
CREATE TABLE mcq_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    responses JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'stress_levels' table
CREATE TABLE stress_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'solutions' table
CREATE TABLE solutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stress_level FLOAT NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'feedback' table
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    responses JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4️⃣ Start the Server  
```sh
node app.js
```
