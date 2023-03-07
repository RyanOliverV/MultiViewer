const { models: { VideoBoard } } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    create: async (req, res) => {
            const video_board_id = uuidv4();

            await VideoBoard.create({
                video_board_id
            });
            res.redirect(`/video-board/${video_board_id}`);
        }
    }