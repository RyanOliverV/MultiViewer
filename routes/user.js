const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.post('/login', (req, res) => {

});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.post('/register', (req, res) => {

});

module.exports = router;