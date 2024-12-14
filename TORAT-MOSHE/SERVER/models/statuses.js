const { sequelize } = require(".");

module.exports=(sequelize,DataTypes)=>{
    const Status = sequelize.define('statuses',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        description: DataTypes.STRING        
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return Status;
}