const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { readFromFile, writeToFile } = require('soly-db');
const userLocal = require('../../sys/local/userLocal');
require('dotenv').config();

const secretKey = process.env.SECRET_JWT;

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const findUserByUsername = (users, username) => users.find(user => user.username === username);

const findUserByEmail = (users, email) => users.find(user => user.email === email);

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '1d' });
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const validateRegistrationInput = (username, email, password, confirmPassword) => {
    if (!username || !email || !password || !confirmPassword) {
        return { isValid: false, message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' };
    }
    if (!isValidEmail(email)) {
        return { isValid: false, message: 'อีเมลไม่ถูกต้อง' };
    }
    if (password !== confirmPassword) {
        return { isValid: false, message: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน' };
    }
    return { isValid: true };
};

router.post('/register', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    const validation = validateRegistrationInput(username, email, password, confirm_password);
    if (!validation.isValid) {
        return res.status(400).json({ status: false, message: validation.message });
    }

    const users = readFromFile(userLocal);

    if (findUserByUsername(users, username)) {
        return res.status(400).json({ status: false, message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' });
    }
    if (findUserByEmail(users, email)) {
        return res.status(400).json({ status: false, message: 'อีเมลนี้มีอยู่ในระบบแล้ว' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: uuid.v4(),
            username,
            email,
            password: hashedPassword,
            timestamp: new Date().toISOString()
        };

        users.push(newUser);
        writeToFile(userLocal, users);

        const token = generateToken(newUser.id);

        const sevenDaysInMilliseconds = 24 * 60 * 60 * 1000;
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: sevenDaysInMilliseconds });

        return res.status(201).json({ status: true, message: 'สมัครสมาชิกเรียบร้อยแล้ว!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาดทางเซิฟเวอร์' });
    }
});

module.exports = router;