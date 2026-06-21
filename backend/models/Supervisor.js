'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supervisor extends Model {
    static associate(models) {
      Supervisor.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Supervisor.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
      Supervisor.hasMany(models.Grade, { foreignKey: 'supervisorId', as: 'grades' });
    }
  }
  Supervisor.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Supervisor',
    tableName: 'Supervisors',
    timestamps: true
  });
  return Supervisor;
};
