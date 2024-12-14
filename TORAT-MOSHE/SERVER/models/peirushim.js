// const { sequelize } = require(".");
// const handwritings = require("./handwritings");
// const users = require("./users");


module.exports=(sequelize,DataTypes)=>{
    const Peirushim = sequelize.define('peirushim',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        handwriting_id: {
            type: DataTypes.INTEGER,
            allowNull: false//notnull
            // references: handwritings, 
            // referenceskey: 'id'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false//notnull
            // references: users, 
            // referenceskey: 'id'
        },
        peirush_text: DataTypes.TEXT,
        permission: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        } 
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return Peirushim;
}