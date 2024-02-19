const {
  models: { Video },
} = require('../models');

module.exports = {
  create: async (req, res) => {
    const body = JSON.parse(req.body.video);
    const video_board_id = req.params.video_board_id;
    const { video_url, position, top, left, width, height } = body;
    const newVideo = await Video.create({
      videoURL: video_url,
      position,
      top,
      left,
      width,
      height,
      video_board_id,
    });
    return newVideo;
  },

  getAllVideos: async (req, res) => {
    const videos = await Video.findAll();
    return videos;
  },

  getVideoById: async (req, res) => {
    const { id } = req.body;
    console.log('Get Video', id);

    const video = await Video.findByPk(id);
    return video;
  },

  getVideoByUserId: async (video_board_id) => {
    const videos = await Video.findAll({ where: { video_board_id } });

    return videos;
  },

  update: async (req, res) => {
    const body = JSON.parse(req.body.videoBoard);
    const { video_board_id } = req.params;
    const { video_url, position, top, left, width, height, id } = body;

    // Update the video
    await Video.update(
      { videoURL: video_url, position, top, left, width, height },
      { where: { id, video_board_id } }
    );
  },

  delete: async (req, res) => {
    const id = req.params.id
    await Video.destroy({ where: { id } });
  },
};
