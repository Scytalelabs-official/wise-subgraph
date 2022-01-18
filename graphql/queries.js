const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} = require("graphql");

// import types
const { responseType } = require("./types/response");

// import Models
const Response = require("../models/response");

const responses = {
  type: GraphQLList(responseType),
  description: "Retrieves list of responses",
  args: {
    start: { type: GraphQLInt },
    end: { type: GraphQLInt },
  },
  async resolve(parent, args, context) {
    try {
      let users = await Response.find();

      return users.splice(args.start, args.end);
    } catch (error) {
      throw new Error(error);
    }
  },
};

const response = {
  type: responseType,
  description: "Retrieves response Id",
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let user = await Response.findOne({ id: args.id });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};


module.exports = {
  responses,
  response
};
