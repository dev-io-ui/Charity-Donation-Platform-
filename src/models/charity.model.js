module.exports = (sequelize, DataTypes) => {
  const Charity = sequelize.define('Charity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    mission: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    donationGoal: {
      type: DataTypes.DECIMAL(10, 2)
    },
    currentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactPhone: {
      type: DataTypes.STRING
    },
    website: {
      type: DataTypes.STRING
    }
  });

  return Charity;
};
