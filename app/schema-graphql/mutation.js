const graphql = require('graphql');

const { UserMutation, PostMutation, CommentMutation } = require('./mutation-handler');

const {
  GraphQLObjectType,
} = graphql;

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: UserMutation.addUser,
    updateUser: UserMutation.updateUser,
    deleteUser: UserMutation.deleteUser,

    addPost: PostMutation.addPost,
    updatePost: PostMutation.updatePost,
    deletePost: PostMutation.deletePost,
    
    addComment: CommentMutation.addComment,
    updateComment: CommentMutation.updateComment,
    deleteComment: CommentMutation.deleteComment,
  })
});

module.exports = Mutation;
