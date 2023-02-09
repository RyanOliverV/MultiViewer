const express = require('express');
const router = express.Router();
const { video } = require('../controllers');
const { user } = require('../controllers');

router.get('/', (req, res) => {
    user.create(req, res);
});

router.post('/:id', (req, res) => {
    video.create(req, res);
});

router.get('/:id', (req, res) => {
    const user_id = req.params.id;
    res.render('video-board', { user_id });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { video_url, position } = req.body;
    video.update({ video_url, position },
        {
            where: {
                id
            }
        });
});

module.exports = router;