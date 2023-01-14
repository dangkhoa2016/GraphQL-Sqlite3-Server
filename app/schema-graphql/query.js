const graphql = require('graphql');
const debug = require('debug')('graphql-sqlite3-server:schema-graphql->query');

const { PostType, UserType, CommentType, UserPagingType,
  PostPagingType, CommentPagingType } = require('./object-type');
const { Post, Comment, User } = require('../models');
const { PagingService } = require('../services');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    getComment: {
      type: CommentType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          const comment = await Comment.findByPk(args.id);
          if (comment)
            resolve(comment);
          else
            reject('Comment not found.');
        });
      },
    },
    getPost: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          const post = await Post.findByPk(args.id);
          if (post)
            resolve(post);
          else
            reject('Post not found.');
        });
      },
    },
    getUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          const user = await User.findByPk(args.id);
          if (user)
            resolve(user);
          else
            reject('User not found.');
        });
      },
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          resolve(await Comment.findAll({}));
        });
      },
    },
    comments_paging_info: {
      type: CommentPagingType,
      args: {
        page_index: { type: GraphQLInt },
        page_size: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          const { page_size, page_index, sort } = args;
          if (sort)
            sort = sort.split('|');
          const { limit, offset } = PagingService.getPagination(page_index, page_size);
          try {
            const data = await Comment.findAndCountAll({
              where: {},
              limit, offset,
              order: sort ? [sort] : null
            });

            const comments = PagingService.getPagingData(data, page_index, limit);
            resolve(comments);
          } catch (error) {
            debug('Error comments_paging_info', error);
            reject({ error: 'Error get list comments.' });
          }
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      args: { page_index: { type: GraphQLInt } },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          if (args.page_index) {
            const limit = 5;
            const page_index = args.page_index || 1;
            if (page_index < 1)
              page_index = 1;
            const offset = (page_index - 1) * limit;
            resolve(await Post.findAll({ limit, offset, where: { status: 'active' } }));
            return;
          }
          
          resolve(await Post.findAll({}));
        });
      },
    },
    posts_paging_info: {
      type: PostPagingType,
      args: {
        page_index: { type: GraphQLInt },
        page_size: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          const { page_size, page_index, sort } = args;
          if (sort)
            sort = sort.split('|');
          const { limit, offset } = PagingService.getPagination(page_index, page_size);
          try {
            const data = await Post.findAndCountAll({
              where: {},
              limit, offset,
              order: sort ? [sort] : null
            });

            const posts = PagingService.getPagingData(data, page_index, limit);
            resolve(posts);
          } catch (error) {
            debug('Error posts_paging_info', error);
            reject({ error: 'Error get list posts.' });
          }
        });
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          resolve(await User.findAll({}));
        });
      },
    },
    users_paging_info: {
      type: UserPagingType,
      args: {
        page_index: { type: GraphQLInt },
        page_size: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          const { page_size, page_index, sort } = args;
          if (sort)
            sort = sort.split('|');
          const { limit, offset } = PagingService.getPagination(page_index, page_size);
          try {
            const data = await User.findAndCountAll({
              where: {},
              limit, offset,
              order: sort ? [sort] : null
            });

            const users = PagingService.getPagingData(data, page_index, limit);
            resolve(users);
          } catch (error) {
            debug('Error users_paging_info', error);
            reject({ error: 'Error get list users.' });
          }
        });
      },
    },
  }),
});

module.exports = RootQuery;
