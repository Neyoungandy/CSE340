const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'); // 
});

module.exports = router;

router.get('/trigger-error', (req, res, next) => {
    throw new Error("Intentional Server Error");
});
