'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      Grade.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
      Grade.belongsTo(models.Supervisor, { foreignKey: 'supervisorId', as: 'supervisor' });
    }
  }
  Grade.init({
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
    supervisorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Supervisors',
        key: 'id'
      }
    },
    scoreWorkAspect: {
      type: DataTypes.INTEGER, // e.g. discipline, teamwork, productivity
      allowNull: false,
      defaultValue: 0
    },
    scoreBehaviorAspect: {
      type: DataTypes.INTEGER, // e.g. attitude, politeness
      allowNull: false,
      defaultValue: 0
    },
    scoreTechnicalAspect: {
      type: DataTypes.INTEGER, // e.g. direct work-related technical skills
      allowNull: false,
      defaultValue: 0
    },
    averageScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Grade',
    tableName: 'Grades',
    timestamps: true
  });
  return Grade;
};
