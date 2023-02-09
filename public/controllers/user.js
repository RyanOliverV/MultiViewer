const { models: { User } } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    create: async (req, res) => {
            const user_id = uuidv4();

            await User.create({
                user_id
            });
            res.redirect(`/video-board/${user_id}`);
        }
    }