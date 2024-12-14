
module.exports=(sequelize,DataTypes)=>{
    const Navigation = sequelize.define('navigation',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER
        },
        label: DataTypes.STRING
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return Navigation;
}