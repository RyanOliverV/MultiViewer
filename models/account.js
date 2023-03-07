module.exports = (sequelize, DataTypes) => {

//user model
module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define( "account", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, 
    {timestamps: true}, )
    return Account;
 }
}