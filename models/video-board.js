module.exports = (sequelize, DataTypes) => {
    
    const Video = sequelize.define('video', {
      videoURL: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('videoURL').split(';')
        },
        set(val) {
           this.setDataValue('videoURL',val.join(';'));
        },
    },
    position: {
      type: DataTypes.JSON,
      allowNull: false
    }
});
    return Video;
}