module.exports = (sequelize, DataTypes) => {

    const VideoBoard = sequelize.define('video_board', 
    {
        video_board_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
          },
    }, 
    {
        freezeTableName: true
    });

    return VideoBoard;

};