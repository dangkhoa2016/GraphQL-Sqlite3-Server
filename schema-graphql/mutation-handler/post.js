const graphql = require('graphql');

const {
  PostType
} = require('../object-type');

const {
  Post
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
  addPost: {
    type: PostType,
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      summary: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      photo: { type: GraphQLString },
      status: {
        type: GraphQLString
      },
      userId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          var post = Post.build({
            title: args.title,
            content: args.content,
            summary: args.summary,
            photo: args.photo,
            status: args.status,
            userId: args.userId,
          });
          post = await post.save();
          resolve(post);
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
  updatePost: {
    type: PostType,
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      summary: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      photo: { type: GraphQLString },
      status: {
        type: GraphQLString
      },
      userId: { type: new GraphQLNonNull(GraphQLID) },
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          await Post.update({
            title: args.title,
            content: args.content,
            summary: args.summary,
            photo: args.photo,
            status: args.status,
            userId: args.userId,
          }, {
              where: { id: args.id }
            });
          var post = await Post.findByPk(args.id);
          resolve(post);
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
  deletePost: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          var post = await Post.findByPk(args.id);
          if (post) {
            try {
              await post.destroy();
            } catch (ex) {

            }
          }
          resolve(post);
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