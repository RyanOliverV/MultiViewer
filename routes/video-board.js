const express = require('express');
const router = express.Router();
const { videos } = require('../controllers');
const { videoBoard } = require('../controllers');

router.get('/', (req, res) => {
  videoBoard.create(req, res);
});

router.post('/:video_board_id', async (req, res) => {
  const myvideo = await videos.create(req, res);
  res.send({ video: myvideo });
});

router.get('/:video_board_id', (req, res) => {
  const { video_board_id } = req.params;
  res.render('video-board', { video_board_id });
});

router.get('/videos/:video_board_id', async (req, res) => {
  const { video_board_id } = req.params;
  const findVideos = await videos.getVideoByUserId(video_board_id);
  res.send({ findVideos }).status(200);
});

router.put('/:video_board_id', async (req, res) => {
  await videos.update(req);
  res.sendStatus(200);
});

router.delete('/videos/:id', async (req, res) => {
  await videos.delete(req);
  res.sendStatus(201);
});

module.exports = router;
