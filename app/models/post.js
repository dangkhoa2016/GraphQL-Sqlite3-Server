'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    summary: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      }
    },
    userId: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      defaultValue: 'active'
    }
  }, {});

  Post.associate = function(models) {
    // associations can be defined here
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments',
      onDelete: 'CASCADE',
    });

    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })
  };

  return Post;
};
