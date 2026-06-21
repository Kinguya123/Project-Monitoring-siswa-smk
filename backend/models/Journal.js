'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    static associate(models) {
      Journal.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    }
  }
  Journal.init({
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    activityDetails: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    progressPercentage: {
      type: DataTypes.INTEGER, // e.g. 40% or 67%
      allowNull: false,
      defaultValue: 0
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified'),
      defaultValue: 'pending',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Journal',
    tableName: 'Journals',
    timestamps: true
  });
  return Journal;
};