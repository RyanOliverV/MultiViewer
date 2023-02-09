module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', 
    {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
          },
    }, 
    {
        freezeTableName: true
    });

    return User;

};