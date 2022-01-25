const Sequelize = require('sequelize');
const config = require('../config/config');

const Product = require('./Product');
const Sale = require('./Sale');
const SaleProduct = require('./SaleProduct');

const Models = [Product, Sale, SaleProduct];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

Models.forEach((Model) => {
    const model = Model(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// index refatorado por https://github.com/GabrielGaspar447
