module.exports=(sequelize,DataTypes)=>{
    const HandWriting = sequelize.define('handWritings',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        image_path: {type: DataTypes.STRING, allowNull: false},
        transcription: {type: DataTypes.TEXT, allowNull: false},
        description: DataTypes.STRING,
        path_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return HandWriting;
}