const { Sequelize } = require('sequelize');
const config = require('../config/database.js').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Charity = require('./charity.model')(sequelize, Sequelize);
db.Donation = require('./donation.model')(sequelize, Sequelize);
db.ImpactReport = require('./impact_report.model')(sequelize, Sequelize);

// Relationships
db.User.hasMany(db.Donation);
db.Donation.belongsTo(db.User);

db.Charity.hasMany(db.Donation);
db.Donation.belongsTo(db.Charity);

db.Charity.hasMany(db.ImpactReport);
db.ImpactReport.belongsTo(db.Charity);

module.exports = db;
