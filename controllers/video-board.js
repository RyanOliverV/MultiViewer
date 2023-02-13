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
        //console.log("Before", body);
        let allVids = await Video.findAll();
        /*console.log(allVids);
        console.log("Before",allVids);
        console.log("body",body);*/
        const { user_id } = req.params;
        const findUser = await Video.findOne({ where: { user_id } });
        const id = findUser.id;
        const findVideo = await module.exports.getVideoById({body: { id }});
        //console.log(findVideo);
        console.log(findVideo);
        //const id = findVideo.id;
        const { video_url, position, width, height } = body;
        //console.log("After", body);
        const video = await Video.update({ videoURL:video_url, position, width, height }, { where: { user_id, videoURL:video_url } });
        //AllVids = await Video.findAll();
        //console.log("After",allVids);
        return video
      },
      
      delete: async (req, res) => {
        const { id } = req.body;
        await Video.destroy({ where: { id } })
      },
}