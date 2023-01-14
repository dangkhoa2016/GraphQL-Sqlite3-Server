'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      defaultValue: 'active'
    }
  }, {});
  
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post'
    });
  };

  return Comment;
};
