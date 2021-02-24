const graphql = require('graphql');

const {
  CommentType
} = require('../object-type');

const {
  Comment
} = require('../../models');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

module.exports = {
  addComment: {
    type: CommentType,
    args: {
      postId: { type: new GraphQLNonNull(GraphQLID) },
      userId: { type: new GraphQLNonNull(GraphQLID) },
      status: {
        type: GraphQLString
      },
      comment: {
        type: GraphQLString
      },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          var comment = Comment.build({
            comment: args.comment,
            userId: args.userId,
            postId: args.postId,
            status: args.status,
          });
          comment = await comment.save();
          resolve(comment);
        } catch (ex) {
          // console.log('ex', ex);
          if (ex.name === 'SequelizeValidationError') {
            reject(ex.errors[0].message);
          }
          else
            reject(ex.message);
        }
      });
    },
  },
  updateComment: {
    type: CommentType,
    args: {
      postId: { type: new GraphQLNonNull(GraphQLID) },
      userId: { type: new GraphQLNonNull(GraphQLID) },
      status: {
        type: GraphQLString
      },
      comment: {
        type: GraphQLString
      },
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          await Comment.update({
            comment: args.comment,
            userId: args.userId,
            postId: args.postId,
            status: args.status,
          }, {
              where: {
                id: args.id
              }
            });
          var comment = await Comment.findByPk(args.id);
          resolve(comment);
        } catch (ex) {
          // console.log('ex', ex);
          if (ex.name === 'SequelizeValidationError') {
            reject(ex.errors[0].message);
          }
          else
            reject(ex.message);
        }
      });
    },
  },
  deleteComment: {
    type: CommentType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          var comment = await Comment.findByPk(args.id);
          if (comment) {
            try {
              await comment.destroy();
            } catch (ex) {

            }
          }
          resolve(comment);
        } catch (ex) {
          // console.log('ex', ex);
          if (ex.name === 'SequelizeValidationError') {
            reject(ex.errors[0].message);
          }
          else
            reject(ex.message);
        }
      });
    },
  }
}