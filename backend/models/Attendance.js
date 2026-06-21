'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    }
  }
  Attendance.init({
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
    checkInTime: {
      type: DataTypes.STRING, // e.g. "07:30"
      allowNull: true
    },
    checkOutTime: {
      type: DataTypes.STRING, // e.g. "17:00"
      allowNull: true
    },
    checkInLocation: {
      type: DataTypes.STRING, // e.g. "Tasikmalaya" or Lat/Lng coordinates
      allowNull: true
    },
    checkOutLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('hadir', 'izin', 'sakit', 'alfa'),
      allowNull: false,
      defaultValue: 'alfa'
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances',
    timestamps: true
  });
  return Attendance;
};