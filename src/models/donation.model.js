module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    }
  });

  Donation.associate = (models) => {
    Donation.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Donation.belongsTo(models.Charity, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Donation;
};
