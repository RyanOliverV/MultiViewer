const express = require('express');
const router = express.Router();
const { video } = require('../controllers');
const { user } = require('../controllers');

router.get('/', (req, res) => {
  user.create(req, res);
});

router.post('/:user_id', async (req, res) => {
  const myvideo = await video.create(req, res);
  res.send({ video: myvideo });
});

router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;
  res.render('video-board', { user_id });
});

router.get('/videos/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const videos = await video.getVideoByUserId(user_id);
  res.send({ videos }).status(200);
});

router.put('/:user_id', async (req, res) => {
  //console.log("Router",req.body)
  // const { id } = req.params;
  // const { video_url, position } = req.body;
  await video.update(req);
  res.sendStatus(200);
});

router.delete('/videos/:user_id', async (req, res) => {
  await video.delete(req);
  res.sendStatus(300);
});

module.exports = router;
