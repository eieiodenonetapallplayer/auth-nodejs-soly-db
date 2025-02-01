const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readFromFile } = require('soly-db');
const userLocal = require('../../sys/local/userLocal');
require('dotenv').config();

const secretKey = process.env.SECRET_JWT;
const router = express.Router();

const findUserByUsername = (users, username) => users.find(user => user.username === username);

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '1d' });
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    const users = readFromFile(userLocal);

    const user = findUserByUsername(users, username);
    if (!user) {
        return res.status(400).json({ status: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = generateToken(user.id);

        const sevenDaysInMilliseconds = 24 * 60 * 60 * 1000;
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: sevenDaysInMilliseconds });

        return res.status(200).json({ status: true, message: 'เข้าสู่ระบบสำเร็จ!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาดทางเซิฟเวอร์' });
    }
});

module.exports = router;