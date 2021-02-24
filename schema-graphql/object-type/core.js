const graphql = require('graphql');
const { Post, Comment, User } = require('../../models');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    birthday: { type: GraphQLString },
    status: { type: GraphQLString },
    points: { type: GraphQLInt },
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent, args) {
        return await Post.findAll({ where: { userId: parent.id } });
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      async resolve(parent, args) {
        return await Comment.findAll({ where: { userId: parent.id } });
      },
    },
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    summary: { type: GraphQLString },
    content: { type: GraphQLString },
    status: { type: GraphQLString },
    photo: { type: GraphQLString },
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    user: {
      type: UserType,
      async resolve(parent, args) {
        return await User.findByPk(parent.userId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      async resolve(parent, args) {
        return await Comment.findAll({ where: { postId: parent.id } });
      },
    },
  })
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    status: { type: GraphQLString },
    post: {
      type: PostType,
      resolve(parent, args) {
        return Post.findByPk(parent.postId);
      },
    },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findByPk(parent.userId);
      },
    },
  })
});

module.exports = { UserType, PostType, CommentType }
