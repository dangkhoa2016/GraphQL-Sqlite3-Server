const graphql = require('graphql');
const { PostType, UserType, CommentType, UserPagingType, PostPagingType, CommentPagingType } = require('./object-type');
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
          var comment = await Comment.findByPk(args.id);
          if (comment)
            resolve(comment);
          else
            reject('Comment not found');
        });
      },
    },
    getPost: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          //test
          // await timeout(3000);
          var post = await Post.findByPk(args.id);
          if (post)
            resolve(post);
          else
            reject('Post not found');
        });
      },
    },
    getUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          var user = await User.findByPk(args.id);
          if (user)
            resolve(user);
          else
            reject('User not found');
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
          var { page_size, page_index, sort } = args;
          if (sort)
            sort = sort.split('|');
          const { limit, offset } = PagingService.getPagination(page_index, page_size);
          try {
            var data = await Comment.findAndCountAll({
                where: {},
                limit, offset,
                order: sort ? [sort] : null
              });

            const comments = PagingService.getPagingData(data, page_index, limit);
            resolve(comments);
          } catch (error) {
            console.log('comments_paging_info', error)
            reject({ error: "Error get list comments" })
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
            var limit = 5;
            var page_index = args.page_index || 1;
            if (page_index < 1)
              page_index = 1;
            var offset = (page_index - 1) * limit;
            resolve(await Post.findAll({ limit, offset, where: { status: 'active' } }));
          }
          else
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
          var { page_size, page_index, sort } = args;
          if (sort)
            sort = sort.split('|');
          const { limit, offset } = PagingService.getPagination(page_index, page_size);
          try {
            var data = await Post.findAndCountAll({
                where: {},
                limit, offset,
                order: sort ? [sort] : null
              });

            const posts = PagingService.getPagingData(data, page_index, limit);
            resolve(posts);
          } catch (error) {
            console.log('posts_paging_info', error)
            reject({ error: "Error get list posts" })
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
          var { page_size, page_index, sort } = args;
          if (sort)
            sort = sort.split('|');
          const { limit, offset } = PagingService.getPagination(page_index, page_size);
          try {
            var data = await User.findAndCountAll({
                where: {},
                limit, offset,
                order: sort ? [sort] : null
              });

            const users = PagingService.getPagingData(data, page_index, limit);
            resolve(users);
          } catch (error) {
            console.log('users_paging_info', error)
            reject({ error: "Error get list users" })
          }
        });
      },
    }
  })
});

module.exports = RootQuery;