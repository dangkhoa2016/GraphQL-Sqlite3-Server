'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      unique: true
    },
    phone: DataTypes.STRING,
    points: DataTypes.INTEGER,
    birthday: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      defaultValue: 'active'
    }
  }, {});
  
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
      onDelete: 'CASCADE',
    });
  };
  return User;
};