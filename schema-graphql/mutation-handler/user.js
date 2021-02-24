const graphql = require('graphql');

const {
  UserType
} = require('../object-type');

const {
  User
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
  addUser: {
    type: UserType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      email: {
        type: new GraphQLNonNull(GraphQLString)
      },
      phone: {
        type: GraphQLString
      },
      status: {
        type: GraphQLString
      },
      birthday: {
        type: GraphQLString
      },
      points: { type: GraphQLInt },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          var user = User.build({
            name: args.name,
            email: args.email,
            phone: args.phone,
            status: args.status,
            birthday: args.birthday,
            points: args.points || 0,
          });
          user = await user.save();
          resolve(user);
        } catch (ex) {
          // console.log('ex', ex);
          if (ex.name === 'SequelizeValidationError') {
            reject(ex.errors[0].message);
          }
          else
            reject(ex.message);
        }
      })
    },
  },
  updateUser: {
    type: UserType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      email: {
        type: new GraphQLNonNull(GraphQLString)
      },
      phone: {
        type: GraphQLString
      },
      status: {
        type: GraphQLString
      },
      birthday: {
        type: GraphQLString
      },
      points: {
        type: GraphQLInt
      },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          await User.update({
            name: args.name,
            email: args.email,
            phone: args.phone,
            status: args.status,
            birthday: args.birthday,
            points: args.points || 0,
          }, {
              where: { id: args.id }
            });
          var user = await User.findByPk(args.id);
          resolve(user);
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
  deleteUser: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
    },
    resolve(parent, args) {
      return new Promise(async (resolve, reject) => {
        try {
          var user = await User.findByPk(args.id);
          if (user) {
            try {
              await user.destroy();
            } catch (ex) {

            }
          }
          resolve(user);
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