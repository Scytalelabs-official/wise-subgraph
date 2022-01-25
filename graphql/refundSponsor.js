const { GraphQLString } = require("graphql");
const { createUser } = require("./shared");

const Response = require("../models/response");
const { responseType } = require("./types/response");
const { RequestHeaderFieldsTooLarge } = require("http-errors");

const handleRefundIssued = {
  type: responseType,
  description: "Handle Refund Issued",
  args: {
    refundedTo: { type: GraphQLString },
    amount: { type: GraphQLString },
    deployHash: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let userID = args.refundedTo;
      let user = await createUser(userID);
      user.gasRefunded = args.amount;
      user.refundTransaction = args.deployHash;
      await user.save();
      let response = await Response.findOne({ id: "1" });
      if (response === null) {
        // create new response
        response = new Response({
          id: "1",
          result: true,
        });
        await response.save();
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = {
  handleRefundIssued,
};
