'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Student.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
      Student.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
      Student.hasMany(models.Attendance, { foreignKey: 'studentId', as: 'attendances' });
      Student.hasMany(models.Journal, { foreignKey: 'studentId', as: 'journals' });
      Student.hasMany(models.Grade, { foreignKey: 'studentId', as: 'grades' });
      Student.hasMany(models.InternshipApplication, { foreignKey: 'studentId', as: 'applications' });
    }
  }
  Student.init({
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
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    nis: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'Students',
    timestamps: true
  });
  return Student;
};
