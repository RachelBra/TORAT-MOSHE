const { sequelize } = require(".");
const statuses = require("./statuses");
const users = require("./users");


module.exports=(sequelize,DataTypes)=>{
    const Purchase = sequelize.define('purchases',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,//notnull
            references: users, 
            referenceskey: 'id'
        },
        credit_confirmation: DataTypes.INTEGER,
        payment: DataTypes.FLOAT(8,2),
        date: DataTypes.DATE,
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,//notnull
            references: statuses, 
            referenceskey: 'id'
        }        
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return Purchase;
}