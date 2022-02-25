// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Import queries
const { responses, response, user, global } = require("./queries");

// Import mutations
const { handleNewResponse } = require("./mutations");

const {
  handleGiveStatus,
  handleStakeStart,
  handleStakeEnd,
  handleInterestScraped,
  handleNewGlobals,
  handleNewSharePrice,
} = require("./wiseToken");

const {
  handleReferralAdded,
  handleWiseReservation,
  handleRefundIssued,
  handleCashBackIssued,
  handleUniswapSwapedResult,
} = require("./liquidityTransformer");

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {
    responses,
    response,
    user,
    global,
  },
});

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    handleNewResponse,
    handleGiveStatus,
    handleStakeStart,
    handleStakeEnd,
    handleInterestScraped,
    handleNewGlobals,
    handleNewSharePrice,
    handleReferralAdded,
    handleWiseReservation,
    handleRefundIssued,
    handleCashBackIssued,
    handleUniswapSwapedResult,
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
