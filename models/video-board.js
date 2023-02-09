module.exports = (sequelize, DataTypes) => {
    
    const Video = sequelize.define('video', {
      video_url: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('video_url').split(';')
        },
        set(val) {
           this.setDataValue('video_url',val.join(';'));
        },
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false
    }
});
    return Video;
}