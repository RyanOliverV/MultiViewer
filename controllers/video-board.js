const { models: { Video } } = require('../models');

module.exports = {
    create: (req, res) => {
        const { video_url, user_id, position } = req.body;
        Video.create({ video_url, user_id, position })
          .then(video => res.status(201).json(video))
          .catch(error => res.status(400).json({ error }));
      },
      
      getAllVideos: (req, res) => {
        Video.findAll()
          .then(videos => res.status(200).json(videos))
          .catch(error => res.status(400).json({ error }));
      },
      
      getVideoById: (req, res) => {
        const { id } = req.params;
        Video.findByPk(id)
          .then(video => {
            if (!video) {
              return res.status(404).json({ error: 'Video not found' });
            }
            return res.status(200).json(video);
          })
          .catch(error => res.status(400).json({ error }));
      },
      
      update: (req, res) => {
        const { id } = req.params;
        const { video_url, user_id, position } = req.body;
        Video.update({ video_url, user_id, position }, { where: { id } })
          .then(() => res.status(200).json({ message: 'Video updated' }))
          .catch(error => res.status(400).json({ error }));
      },
      
      delete: (req, res) => {
        const { id } = req.params;
        Video.destroy({ where: { id } })
          .then(() => res.status(200).json({ message: 'Video deleted' }))
          .catch(error => res.status(400).json({ error }));
      },
      
}