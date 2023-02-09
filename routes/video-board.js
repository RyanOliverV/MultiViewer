const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { video } = require('../controllers');

router.get('/', (req, res) => {
    const user_id = uuidv4();
    res.redirect(`/video-board/${user_id}`);
});

router.post('/', (req, res) => {
    video.create(req, res);
});

router.get('/:id', (req, res) => {
    const user_id = req.params.id;
    res.render('video-board', { user_id });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { video_url, user_id, position } = req.body;
    video.update(req, res, id, { video_url, user_id, position });
});

module.exports = router;