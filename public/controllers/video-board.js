const { models: { Video } } = require('../models');

module.exports = {
    create: async (req, res) => {
        const body = JSON.parse(req.body.video)
        const user_id = req.params.id;
        const { video_url, position } = body;
        const newVideo = await Video.create({ videoURL:video_url, position,user_id })
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
        const body  = JSON.parse(req.body.videoBoard);
        let allVids = await Video.findAll();
        console.log(allVids);
        console.log("Before",allVids);
        console.log("body",body);
        const { id } = req.params;
        const { video_url, position } = body;
        const video = await Video.update({ videoURL:video_url, position }, { where: { user_id:id,videoURL:video_url } })
         allVids = await Video.findAll();
        console.log("After",allVids);
        return video
      },
      
      delete: async (req, res) => {
        const { id } = req.body;
        await Video.destroy({ where: { id } })
      },
}