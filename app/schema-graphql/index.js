const graphql = require('graphql');
const RootQuery = require('./query');
const Mutation = require('./mutation');

const {
  GraphQLSchema,
} = graphql;

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = Schema;
