const { models: { Video } } = require('../models');

module.exports = {
    create: async (req, res) => {
        const body = JSON.parse(req.body.video)
        const user_id = req.params.user_id;
        const {video_url, position, width, height } = body;
        //console.log("Create",body);
        const newVideo = await Video.create({videoURL:video_url, position, width, height, user_id })
        return newVideo
      },
      
      getAllVideos: async (req, res) => {
        
        const videos = await Video.findAll()
        //console.log(videos);
        return videos
      },
      
      getVideoById: async (req, res) => {
        const { id } = req.body;
        console.log("Get Video", id);
        
        const video = await Video.findByPk(id)
        return video
      },
      
      update: async (req, res) => {
        const body  = JSON.parse(req.body.videoBoard);
        const { user_id } = req.params;
        const { video_url, position, width, height } = body;
        
        // Find the video you want to update based on user_id
        const findVideo = await Video.findOne({ where: { user_id } });
    
        // Get the id of the video
        const id = findVideo.id;
        console.log("ID:", id);
        
        // Update the video
        const video = await Video.update({ videoURL:video_url, position, width, height }, { where: { id } });
        return video
    },
      
      delete: async (req, res) => {
        const { id } = req.body;
        await Video.destroy({ where: { id } })
      },
}