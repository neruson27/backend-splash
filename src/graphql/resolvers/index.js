import fs from'fs';
import path from 'path';

const { GraphQLScalarType, Kind } = require('graphql');

const ObjectScalarType = new GraphQLScalarType({
  name: 'Object',
  description: 'Arbitrary object',
  parseValue: (value) => {
    return typeof value === 'object' ? value
      : typeof value === 'string' ? JSON.parse(value)
      : null
  },
  serialize: (value) => {
    return typeof value === 'object' ? value
      : typeof value === 'string' ? JSON.parse(value)
      : null
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING: return JSON.parse(ast.value)
      case Kind.OBJECT: throw new Error(`Not sure what to do with OBJECT for ObjectScalarType`)
      default: return null
    }
  }
})

export default (() => {
  let resolvers = {Query: {}, Mutation: {}};
  // let resolvers = {Query: {}, Mutation: {}, Subscription: {}};
  fs
    .readdirSync(__dirname)
    .filter((file) => {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
    .forEach((file) => {
      // importo todos los squemas 
        let rsver = require(path.join(__dirname, file));
        // console.log('rsver: ', rsver);
        Object.assign(resolvers.Query, rsver.Query);
        Object.assign(resolvers.Mutation, rsver.Mutation);
        // Object.assign(resolvers.Subscription, rsver.Subscription);
  });
  resolvers['Object'] = ObjectScalarType
  return resolvers
})()