module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', 
    {
        user_id: {
            type: DataTypes.INT,
            allowNull: false,
            primaryKey: true,
            AUTO_INCREMENT: true
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          }
    }, 
    {
    });

    return User;

};