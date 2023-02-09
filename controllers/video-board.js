const { models: { Video } } = require('../models');

module.exports = {
    create: (req, res) => {
        const { video_url, user_id, position } = req.body;
        Video.create({ video_url, user_id, position })
      },
      
      getAllVideos: (req, res) => {
        Video.findAll()
      },
      
      getVideoById: (req, res) => {
        const { id } = req.params;
        Video.findByPk(id)
      },
      
      update: (req, res) => {
        const { id } = req.params;
        const { video_url, user_id, position } = req.body;
        Video.update({ video_url, user_id, position }, { where: { id } })
      },
      
      delete: (req, res) => {
        const { id } = req.params;
        Video.destroy({ where: { id } })
      },
}