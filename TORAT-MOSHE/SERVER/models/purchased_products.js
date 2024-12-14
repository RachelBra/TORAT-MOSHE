// לחנות
const { sequelize } = require(".");
const purchases = require("./purchases");
const handWritings = require("./handWritings");
const books = require("./books");




module.exports=(sequelize,DataTypes)=>{
    const Purchased_product = sequelize.define('purchased_products',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        purchase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,//notnull
            references: purchases, 
            referenceskey: 'id'
        },
        product_id:{
            type: DataTypes.INTEGER,
            allowNull: false,//notnull
            references: handWritings,
            referenceskey: 'id',
            references: books,
            referenceskey: 'id'
        },
        amount: DataTypes.INTEGER

    },
    {
        freezeTableName:true,
        timestamps: false
    });
    return Purchased_product;
}