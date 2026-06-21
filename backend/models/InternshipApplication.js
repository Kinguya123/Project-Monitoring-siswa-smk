'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InternshipApplication extends Model {
    static associate(models) {
      InternshipApplication.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
      InternshipApplication.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    }
  }
  InternshipApplication.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
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
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'InternshipApplication',
    tableName: 'InternshipApplications',
    timestamps: true
  });
  return InternshipApplication;
};