module.exports = (sequelize, DataTypes) => {
    
    const Video = sequelize.define('video', {
      videoURL: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('video_id').split(';')
        },
        set(val) {
           this.setDataValue('video_id',val.join(';'));
        },
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false
    }
});
    return Video;
}