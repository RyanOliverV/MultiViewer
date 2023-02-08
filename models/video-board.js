module.exports = (sequelize, DataTypes) => {
    
    const Video = sequelize.define('video', {
    video_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false
    }
});
    return Video;
}