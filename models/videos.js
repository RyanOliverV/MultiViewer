module.exports = (sequelize, DataTypes) => {
    
    const Video = sequelize.define('video', {

    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
      },

      videoURL: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('videoURL').split(';')
        },
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false
    },     
    
    top: {
      type: DataTypes.JSON,
      allowNull: false
    },

    left: {
      type: DataTypes.JSON,
      allowNull: false
    },

    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    video_board_id: {
    type: DataTypes.UUID,
    foreignKey: true
  },
});
    return Video;
}