const dbConfig = require('../db_config/dbConfig');
// const {DB} = require('../db_config/dbConfig');

const { Sequelize, DataTypes } = require('sequelize');
const peirushim = require('./peirushim');
const handwritings = require('./handwritings');
const comments = require('./comments');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
}
)
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const db = {}


db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require('./users.js')(sequelize, DataTypes)
db.navigation = require('./navigation')(sequelize, DataTypes)
db.books = require('./books')(sequelize, DataTypes)
db.peirushim = require('./peirushim')(sequelize, DataTypes)
db.comments = require('./comments')(sequelize, DataTypes)
db.corrections = require('./corrections')(sequelize, DataTypes)
db.handwritings = require('./handwritings')(sequelize, DataTypes)
// db.statuses = require('./statuses')(sequelize, DataTypes)
// db.purchases = require('./purchases')(sequelize, DataTypes)
// db.purchased_products = require('./purchased_products')(sequelize, DataTypes)


db.handwritings.hasMany(db.corrections,{foreignKey:'handwriting_id'});
db.corrections.belongsTo(db.handwritings,{targetKey: 'id', foreignKey:'handwriting_id'});

db.handwritings.hasMany(db.peirushim,{foreignKey:'handwriting_id'});
db.peirushim.belongsTo(db.handwritings,{targetKey: 'id', foreignKey:'handwriting_id'});

db.peirushim.hasMany(db.comments,{foreignKey:'peirush_id'});
db.comments.belongsTo(db.peirushim,{targetKey: 'id', foreignKey:'peirush_id'});

db.peirushim.belongsTo(db.handwritings,{targetKey: 'id', foreignKey:'handwriting_id'});
db.peirushim.belongsTo(db.users,{targetKey: 'id', foreignKey:'user_id'});
db.comments.belongsTo(db.users,{targetKey: 'id', foreignKey:'user_id'});
db.corrections.belongsTo(db.users,{targetKey: 'id', foreignKey:'user_id'});
db.navigation.belongsTo(db.navigation,{targetKey: 'id', foreignKey:'parent_id'});


db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })
module.exports = db
