module.exports = (sequelize, DataTypes) => {
  const ImpactReport = sequelize.define('ImpactReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    beneficiariesCount: {
      type: DataTypes.INTEGER
    },
    fundsUtilized: {
      type: DataTypes.DECIMAL(10, 2)
    },
    reportDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return ImpactReport;
};
