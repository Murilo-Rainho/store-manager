require('dotenv').config();

module.exports = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: 'StoreManager',
  dialect: 'mysql',
};
