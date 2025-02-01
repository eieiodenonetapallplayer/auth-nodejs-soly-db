const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    
    res.status(200).json({ status: true, message: 'ออกจากระบบสำเร็จ' });
});

module.exports = router;