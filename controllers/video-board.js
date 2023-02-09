const { models: { Video } } = require('../models');

module.exports = {
    create: async (req, res) => {
        const { video_url, user_id, position } = req.body;
        
        const newVideo = await Video.create({ video_url, user_id, position })
        return newVideo
      },
      
      getAllVideos: async (req, res) => {
        
        const videos = await Video.findAll()
        return videos
      },
      
      getVideoById: async (req, res) => {
        const { id } = req.params;
        
        const video = await Video.findByPk(id)
        return video
      },
      
      update: async (req, res) => {
        const { id } = req.params;
        const { video_url, user_id, position } = req.body;
        const video = await Video.update({ video_url, user_id, position }, { where: { id } })
        return video
      },
      
      delete: async (req, res) => {
        const { id } = req.params;
        await Video.destroy({ where: { id } })
      },
}