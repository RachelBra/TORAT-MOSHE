const { sequelize } = require(".");

module.exports=(sequelize,DataTypes)=>{
    const User = sequelize.define('users',{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email:{
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            unique:true
        },
        email_confirm:{
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        password: DataTypes.STRING,
        // phone_number: DataTypes.STRING,
        authorization: {
            type: DataTypes.INTEGER,
            defaultValue: 1
            // type:DataTypes.ENUM('USER', 'ADMIN', 'BLOCK'),
            // defaultValue:'USER'
        }
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return User;
}

