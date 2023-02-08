const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { video } = require('../../controllers');

router.get('/', (req, res) => {
    const user_id = uuidv4();
    res.redirect(`/video-board/${user_id}`);
});

router.post('/', (req, res) => {
    const { video_url, user_id, position } = req.body;
    video.create(req, res, { video_url, user_id, position })
});

router.get('/:id', (req, res) => {
    const user_id = req.params.id;
    res.render('video-board', { user_id });
});

module.exports = router;