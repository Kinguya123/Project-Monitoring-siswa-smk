'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.Student, { foreignKey: 'companyId', as: 'students' });
      Company.hasMany(models.Supervisor, { foreignKey: 'companyId', as: 'supervisors' });
      Company.hasMany(models.InternshipApplication, { foreignKey: 'companyId', as: 'applications' });
    }
  }
  Company.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mentorName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'Companies',
    timestamps: true
  });
  return Company;
};
