var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const uniswapSwapedResultSchema = new Schema({
  id: {
    type: String,
  },
  tokenA: {
    type: String,
  },
  tokenB: {
    type: String,
  },
  amounttokenA: {
    type: String,
  },
  amounttokenB: {
    type: String,
  },
  liquidity: {
    type: String,
  },
  pair: {
    type: String,
  },
  to: {
    type: String,
  },
});

var uniswapSwapedResult = mongoose.model(
  "uniswapSwapedResult",
  uniswapSwapedResultSchema
);
module.exports = uniswapSwapedResult;
