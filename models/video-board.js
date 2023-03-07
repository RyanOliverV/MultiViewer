module.exports = (sequelize, DataTypes) => {

    const VideoBoard = sequelize.define('video_board', 
    {
        video_board_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    }, 
    {
        freezeTableName: true
    });

    return VideoBoard;

};