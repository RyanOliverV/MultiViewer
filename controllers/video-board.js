const { models: { Video } } = require('../models');

module.exports = {
    create: async (req, res) => {
        console.log("create",req.body);
        const { video_url, position } = req.body;
        const newVideo = await Video.create({ video_url, position })
        return newVideo
      },
      
      getAllVideos: async (req, res) => {
        
        const videos = await Video.findAll()
        //console.log(videos);
        return videos
      },
      
      getVideoById: async (req, res) => {
        const { id } = req.body;
        
        const video = await Video.findByPk(id)
        return video
      },
      
      update: async (req, res) => {
        const obj = JSON.parse(JSON.stringify(req));
        const { id } = obj;
        const { video_url, position } = obj;
        const video = await Video.update({ video_url, position }, { where: { id } })
        return video
      },
      
      delete: async (req, res) => {
        const { id } = req.body;
        await Video.destroy({ where: { id } })
      },
}