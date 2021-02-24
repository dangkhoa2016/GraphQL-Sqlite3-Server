const graphql = require('graphql');
const { Post, Comment, User } = require('../../models');
const { UserType, PostType, CommentType } = require('./core');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = graphql;

const UserPagingType = new GraphQLObjectType({
  name: 'UserPaging',
  fields: () => ({
    current_page: { type: GraphQLInt },
    last_page: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: { type: GraphQLList(UserType) }
  })
});

const PostPagingType = new GraphQLObjectType({
  name: 'PostPaging',
  fields: () => ({
    current_page: { type: GraphQLInt },
    last_page: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: { type: GraphQLList(PostType) }
  })
});

const CommentPagingType = new GraphQLObjectType({
  name: 'CommentPaging',
  fields: () => ({
    current_page: { type: GraphQLInt },
    last_page: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: { type: GraphQLList(CommentType) }
  })
});

module.exports = { UserPagingType, PostPagingType, CommentPagingType }
