// const { sequelize } = require(".");
// const peirushim = require("./peirushim");
// const users = require("./users");



module.exports=(sequelize,DataTypes)=>{
    const Comment = sequelize.define('comments',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        peirush_id: {
            type: DataTypes.INTEGER,
            allowNull: false//notnull
            // references: peirushim, 
            // referenceskey: 'id'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false//notnull
            // references: users, 
            // referenceskey: 'id'
        },
        comment_text: DataTypes.STRING,
        permission: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        } 
        
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return Comment;
}