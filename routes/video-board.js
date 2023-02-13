const express = require('express');
const router = express.Router();
const { video } = require('../controllers');
const { user } = require('../controllers');

router.get('/', (req, res) => {
    user.create(req, res);
});

router.post('/:user_id', (req, res) => {
    video.create(req, res);
});

router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    res.render('video-board', { user_id });
});

router.put('/:user_id', async(req, res) => {
    //console.log("Router",req.body)
    // const { id } = req.params;
    // const { video_url, position } = req.body;
    await video.update(req);
    res.sendStatus(200)
});

module.exports = router;