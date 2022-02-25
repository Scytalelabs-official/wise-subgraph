require("dotenv").config();
var express = require("express");
var router = express.Router();
const axios = require("axios").default;
var { request } = require("graphql-request");

function splitdata(data) {
  var temp = data.split("(");
  var result = temp[1].split(")");
  return result[0];
}

router.route("/startListener").post(async function (req, res, next) {
  try {
    if (!req.body.contractPackageHashes) {
      return res.status(400).json({
        success: false,
        message: "There is no contractPackageHash specified in the req body.",
      });
    }

    await axios
      .post("http://localhost:3001/listener/initiateListener", {
        contractPackageHashes: req.body.contractPackageHashes,
      })
      .then(function (response) {
        console.log(response);
        return res.status(200).json({
          success: true,
          message: response.data.message,
          status: response.data.status,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      err: error,
    });
  }
});
router.route("/geteventsdata").post(async function (req, res, next) {
  try {
    if (!req.body.deployHash) {
      return res.status(400).json({
        success: false,
        message: "There is no deployHash specified in the req body.",
      });
    }
    if (!req.body.timestamp) {
      return res.status(400).json({
        success: false,
        message: "There is no timestamp specified in the req body.",
      });
    }
    if (!req.body.block_hash) {
      return res.status(400).json({
        success: false,
        message: "There is no blockHash specified in the req body.",
      });
    }
    if (!req.body.eventname) {
      return res.status(400).json({
        success: false,
        message: "There is no eventname specified in the req body.",
      });
    }
    if (!req.body.eventdata) {
      return res.status(400).json({
        success: false,
        message: "There is no eventdata specified in the req body.",
      });
    }

    let newData = req.body.eventdata;
    let deployHash = req.body.deployHash;
    let timestamp = req.body.timestamp;
    let block_hash = req.body.block_hash;
    let eventName = req.body.eventname;
    console.log("... Deployhash: ", deployHash);
    console.log("... Timestamp: ", timestamp);
    console.log("... Block hash: ", block_hash);
    console.log("Event Data: ", newData);

    if (eventName == "refundIssued") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var refundedTo = splitdata(newData[2][1].data);
      var amount = newData[3][1].data;

      console.log("refundedTo: ", refundedTo);
      console.log("amount: ", amount);

      console.log("Calling handleRefundIssued mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleRefundIssued( $refundedTo: String!, $amount: String!, $deployHash: String!){
                handleRefundIssued( refundedTo: $refundedTo, amount: $amount, deployHash: $deployHash) {
                  result
              }
                        
              }`,
        {
          refundedTo: refundedTo,
          amount: amount,
          deployHash: deployHash,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleRefundIssued Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "cashBackIssued") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);

      var totalCashBack = newData[2][1].data;
      var senderAddress = splitdata(newData[3][1].data);
      var senderValue = newData[4][1].data;
      var cashBackAmount = newData[5][1].data;

      console.log("totalCashBack: ", totalCashBack);
      console.log("senderAddress: ", senderAddress);
      console.log("senderValue: ", senderValue);
      console.log("cashBackAmount: ", cashBackAmount);

      console.log("Calling handleCashBackIssued mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleCashBackIssued( $totalCashBack:String!, $senderAddress: String!, $senderValue: String!,$cashBackAmount: String!, $deployHash: String!){
                handleCashBackIssued( totalCashBack:$totalCashBack, senderAddress: $senderAddress, senderValue: $senderValue, cashBackAmount: $cashBackAmount, deployHash: $deployHash) {
                  result
              }
                        
              }`,
        {
          totalCashBack: totalCashBack,
          senderAddress: senderAddress,
          senderValue: senderValue,
          cashBackAmount: cashBackAmount,
          deployHash: deployHash,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleCashBackIssued Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "give_status") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);

      var referrerId = splitdata(newData[2][1].data);

      console.log("referrerId: ", referrerId);

      console.log("Calling handleGiveStatus mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleGiveStatus( $referrerId: String!){
            handleGiveStatus( referrerId: $referrerId) {
                    result
                }
                          
                }`,
        {
          referrerId: referrerId,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleGiveStatus  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "uniswapSwapResult") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);

      var amountTokenA = newData[2][1].data;
      var amountTokenB = newData[3][1].data;
      var liquidity = newData[4][1].data;

      console.log("amountTokenA: ", amountTokenA);
      console.log("amountTokenB: ", amountTokenB);
      console.log("liquidity: ", liquidity);

      console.log("Calling handleUniswapSwapedResult mutation...");
      let response = await request(
        process.env.GRAPHQL,
        `mutation handleUniswapSwapedResult( $amountTokenA:String!,$ amountTokenB: String!, $liquidity: String!,$deployHash: String!){
            handleUniswapSwapedResult( amountTokenA:$amountTokenA,  amountTokenB: $ amountTokenB, liquidity: $ liquidity, deployHash: $deployHash) {
              result
          }
                    
          }`,
        {
          amountTokenA: amountTokenA,
          amountTokenB: amountTokenB,
          liquidity: liquidity,
          deployHash: deployHash,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleUniswapSwapedResult  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "uniswap_reserves") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);

      var reserveA = newData[2][1].data;
      var reserveB = newData[3][1].data;
      var blockTimestampLast = newData[4][1].data;

      console.log("reserveA: ", reserveA);
      console.log("reserveB: ", reserveB);
      console.log("blockTimestampLast: ", blockTimestampLast);

      console.log("Calling handleUniswapReserves mutation...");
      let response = await request(
        process.env.GRAPHQL,
        `mutation handleUniswapReserves( $reserveA:String!,$ reserveB: String!, $blockTimestampLast: String!){
            handleUniswapReserves( reserveA:$reserveA,  reserveB: $ reserveB, blockTimestampLast: $ blockTimestampLast) {
              result
          }
                    
          }`,
        {
          reserveA: reserveA,
          reserveB: reserveB,
          blockTimestampLast: blockTimestampLast,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleUniswapReserves  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "liquidity_guard_status") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);

      var liquidityGuardStatusString = newData[2][1].data;

      console.log("liquidityGuardStatusString: ", liquidityGuardStatusString);

      let liquidityGuardStatus = false;
      if (liquidityGuardStatusString == "true") {
        liquidityGuardStatus = true;
      } else {
        liquidityGuardStatus = false;
      }
      console.log("Calling handleLiquidityGuardStatus mutation...");
      let response = await request(
        process.env.GRAPHQL,
        `mutation handleLiquidityGuardStatus( $liquidityGuardStatus:Boolean!){
            handleLiquidityGuardStatus( liquidityGuardStatus:$liquidityGuardStatus) {
              result
          }
                    
          }`,
        {
          liquidityGuardStatus: liquidityGuardStatus,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleLiquidityGuardStatus  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "referral_collected") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);
      console.log(newData[6][0].data + " = " + newData[6][1].data);

      var staker = splitdata(newData[2][1].data);
      var stakerId = newData[3][1].data;
      var referrer = splitdata(newData[4][1].data);
      var referrerId = newData[5][1].data;
      var rewardAmount = newData[6][1].data;

      console.log("staker: ", staker);
      console.log("stakerId: ", stakerId);
      console.log("referrer: ", referrer);
      console.log("referrerId: ", referrerId);
      console.log("rewardAmount: ", rewardAmount);
    } else if (eventName == "stake_start") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);
      console.log(newData[6][0].data + " = " + newData[6][1].data);
      console.log(newData[7][0].data + " = " + newData[7][1].data);
      console.log(newData[8][0].data + " = " + newData[8][1].data);
      console.log(newData[9][0].data + " = " + newData[9][1].data);
      console.log(newData[10][0].data + " = " + newData[10][1].data);

      var stakerAddress = splitdata(newData[2][1].data);
      var referralAddress = splitdata(newData[3][1].data);
      var referralShares = newData[4][1].data;
      var stakeID = splitdata(newData[5][1].data);
      var stakedAmount = newData[6][1].data;
      var stakesShares = newData[7][1].data;
      var startDay = newData[8][1].data;
      var lockDays = newData[9][1].data;
      var daiEquivalent = newData[10][1].data;

      console.log("stakerAddress: ", stakerAddress);
      console.log("referralAddress: ", referralAddress);
      console.log("referralShares: ", referralShares);
      console.log("stakeID: ", stakeID);
      console.log("stakedAmount: ", stakedAmount);
      console.log("stakesShares: ", stakesShares);
      console.log("startDay: ", startDay);
      console.log("lockDays: ", lockDays);
      console.log("daiEquivalent: ", daiEquivalent);

      console.log("Calling handleStakeStart mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleStakeStart( 
          $stakerAddress: String!,
          $referralAddress: String!,
          $referralShares: String!,
          $stakeID: String!,
          $stakedAmount: String!,
          $stakesShares: String!,
          $startDay: String!,
          $lockDays: String!,
          $daiEquivalent: String!
          ){
          handleStakeStart( 
            stakerAddress:$stakerAddress,
            referralAddress:$referralAddress,
            referralShares: $referralShares,
            stakeID:$stakeID,
            stakedAmount:$stakedAmount,
            stakesShares:$stakesShares,
            startDay:$startDay,
            lockDays:$lockDays,
            daiEquivalent:$daiEquivalent
            ) {
                  result
              }
                        
              }`,
        {
          stakerAddress: stakerAddress,
          referralAddress: referralAddress,
          referralShares: referralShares,
          stakeID: stakeID,
          stakedAmount: stakedAmount,
          stakesShares: stakesShares,
          startDay: startDay,
          lockDays: lockDays,
          daiEquivalent: daiEquivalent,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleStakeStart  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "stake_end") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);
      console.log(newData[6][0].data + " = " + newData[6][1].data);
      console.log(newData[7][0].data + " = " + newData[7][1].data);
      console.log(newData[8][0].data + " = " + newData[8][1].data);
      console.log(newData[9][0].data + " = " + newData[9][1].data);
      console.log(newData[10][0].data + " = " + newData[10][1].data);

      var stakeID = splitdata(newData[2][1].data);
      var stakerAddress = splitdata(newData[3][1].data);
      var referralAddress = splitdata(newData[4][1].data);
      var stakedAmount = newData[5][1].data;
      var stakesShares = newData[6][1].data;
      var referralShares = newData[7][1].data;
      var rewardAmount = newData[8][1].data;
      var closeDay = newData[9][1].data;
      var penaltyAmount = newData[10][1].data;

      console.log("stakeID: ", stakeID);
      console.log("stakerAddress: ", stakerAddress);
      console.log("referralAddress: ", referralAddress);
      console.log("stakedAmount: ", stakedAmount);
      console.log("stakesShares: ", stakesShares);
      console.log("referralShares: ", referralShares);
      console.log("rewardAmount: ", rewardAmount);
      console.log("closeDay: ", closeDay);
      console.log("penaltyAmount: ", penaltyAmount);

      console.log("Calling handleStakeEnd mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleStakeEnd( $stakeID: String!, $closeDay: String!, $rewardAmount: String!,$penaltyAmount:String!){
          handleStakeEnd( stakeID: $stakeID, closeDay: $closeDay, rewardAmount: $rewardAmount,penaltyAmount:$penaltyAmount) {
                  result
              }
                        
              }`,
        {
          stakeID: stakeID,
          closeDay: closeDay,
          rewardAmount: rewardAmount,
          penaltyAmount: penaltyAmount,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleStakeEnd  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "interest_scraped") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);
      console.log(newData[6][0].data + " = " + newData[6][1].data);
      console.log(newData[7][0].data + " = " + newData[7][1].data);
      console.log(newData[8][0].data + " = " + newData[8][1].data);

      var stakeID = splitdata(newData[2][1].data);
      var stakerAddress = splitdata(newData[3][1].data);
      var scrapeAmount = newData[4][1].data;
      var scrapeDay = newData[5][1].data;
      var stakersPenalty = newData[6][1].data;
      var referrerPenalty = newData[7][1].data;
      var currentWiseDay = newData[8][1].data;

      console.log("stakeID: ", stakeID);
      console.log("stakerAddress: ", stakerAddress);
      console.log("scrapeAmount: ", scrapeAmount);
      console.log("scrapeDay: ", scrapeDay);
      console.log("stakersPenalty: ", stakersPenalty);
      console.log("referrerPenalty: ", referrerPenalty);
      console.log("currentWiseDay: ", currentWiseDay);

      console.log("Calling handleInterestScraped mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleInterestScraped(  
            $stakeID:String!,
            $scrapeDay:String!,
            $scrapeAmount:String!,
            $stakersPenalty:String!,
            $referrerPenalty:String!
            ){
            handleInterestScraped( 
              stakeID:$stakeID,
              scrapeDay:$scrapeDay,
              scrapeAmount:$scrapeAmount,
              stakersPenalty:$stakersPenalty,
              referrerPenalty:$referrerPenalty
              ) {
                    result
                }
                          
                }`,
        {
          stakeID: stakeID,
          scrapeDay: scrapeDay,
          scrapeAmount: scrapeAmount,
          stakersPenalty: stakersPenalty,
          referrerPenalty: referrerPenalty,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleInterestScraped  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "new_globals") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);
      console.log(newData[6][0].data + " = " + newData[6][1].data);

      var totalShares = newData[2][1].data;
      var totalStaked = newData[3][1].data;
      var shareRate = newData[4][1].data;
      var referrerShares = newData[5][1].data;
      var currentWiseDay = newData[6][1].data;
      var wiseAddress = process.env.WISETOKEN_CONTRACT_HASH;
      var UNISWAP_PAIR = process.env.UNISWAP_PAIR_HASH;

      console.log("totalShares: ", totalShares);
      console.log("totalStaked: ", totalStaked);
      console.log("shareRate: ", shareRate);
      console.log("referrerShares: ", referrerShares);
      console.log("currentWiseDay: ", currentWiseDay);
      console.log("wiseAddress: ", wiseAddress);
      console.log("UNISWAP_PAIR: ", UNISWAP_PAIR);

      console.log("Calling handleNewGlobals mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleNewGlobals( 
            $totalShares: String!, 
            $totalStaked: String!, 
            $shareRate: String!, 
            $referrerShares: String!, 
            $currentWiseDay: String!, 
            $wiseAddress: String!, 
            $UNISWAP_PAIR: String!)
            {
            handleNewGlobals( 
              totalShares: $totalShares, 
              totalStaked: $totalStaked, 
              shareRate: $shareRate,
              referrerShares: $referrerShares,
              currentWiseDay: $currentWiseDay,
              wiseAddress: $wiseAddress,
              UNISWAP_PAIR: $UNISWAP_PAIR) {
                    result
                }
                          
                }`,
        {
          totalShares: totalShares,
          totalStaked: totalStaked,
          shareRate: shareRate,
          referrerShares: referrerShares,
          currentWiseDay: currentWiseDay,
          wiseAddress: wiseAddress,
          UNISWAP_PAIR: UNISWAP_PAIR,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleNewGlobals  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "new_share_price") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);

      var newSharePrice = newData[2][1].data;
      var oldSharePrice = newData[3][1].data;
      var currentWiseDay = newData[4][1].data;

      console.log("newSharePrice: ", newSharePrice);
      console.log("oldSharePrice: ", oldSharePrice);
      console.log("currentWiseDay: ", currentWiseDay);

      console.log("Calling handleNewSharePrice mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleNewSharePrice( $newSharePrice: String!, $oldSharePrice: String!){
            handleNewSharePrice( newSharePrice: $newSharePrice, oldSharePrice: $oldSharePrice) {
                    result
                }
                          
                }`,
        {
          newSharePrice: newSharePrice,
          oldSharePrice: oldSharePrice,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleNewSharePrice  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "referral_added") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);

      var from = splitdata(newData[2][1].data);
      var referral = splitdata(newData[3][1].data);
      var referee = splitdata(newData[4][1].data);
      var amount = newData[5][1].data;

      console.log("from: ", from);
      console.log("referral: ", referral);
      console.log("referee: ", referee);
      console.log("amount: ", amount);

      console.log("Calling handleReferralAdded mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleReferralAdded( 
            $deployHash:String!,
            $blockHash:String!,
            $timestamp:String!,
            $from:String!,
            $referral:String!,
            $referee:String!,
            $amount:String!
            ){
            handleReferralAdded( 
              deployHash:$deployHash,
              blockHash:$blockHash,
              timestamp:$timestamp,
              from:$from,
              referral:$referral,
              referee:$referee,
              amount:$amount
              ) {
                    result
                }
                          
                }`,
        {
          deployHash: deployHash,
          blockHash: block_hash,
          timestamp: timestamp,
          from: from,
          referral: referral,
          referee: referee,
          amount: amount,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleReferralAdded  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "wiseReservation") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);

      var from = splitdata(newData[2][1].data);
      var investmentDay = newData[3][1].data;
      var amount = newData[4][1].data;
      var currentWiseDay = newData[5][1].data;
      var investmentMode = newData[6][1].data;

      console.log("from: ", from);
      console.log("investmentDay: ", investmentDay);
      console.log("amount: ", amount);
      console.log("currentWiseDay: ", currentWiseDay);
      console.log("investmentMode: ", investmentMode);

      console.log("Calling handleWiseReservation mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleWiseReservation( 
            $deployHash:String!,
            $blockHash:String!,
            $timestamp:String!,
            $from:String!,
            $investmentDay:String!,
            $amount:String!
            ){
            handleWiseReservation( 
            deployHash:$deployHash,
            blockHash:$blockHash,
            timestamp:$timestamp,
            from:$from,
            investmentDay:$investmentDay,
            amount:$amount
            ) {
                    result
                }
                          
                }`,
        {
          deployHash: deployHash,
          blockHash: block_hash,
          timestamp: timestamp,
          from: from,
          investmentDay: investmentDay,
          amount: amount,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleWiseReservation  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "depositedLiquidity") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var depositAmount = newData[2][1].data;
      var transformerAddress = splitdata(newData[3][1].data);

      console.log("depositAmount: ", depositAmount);
      console.log("transformerAddress: ", transformerAddress);
    } else if (eventName == "withdrawal") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var fromAddress = splitdata(newData[2][1].data);
      var tokenAmount = newData[3][1].data;

      console.log("fromAddress: ", fromAddress);
      console.log("tokenAmount: ", tokenAmount);
    } else if (eventName == "formedLiquidityv") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);
      console.log(newData[5][0].data + " = " + newData[5][1].data);

      var coverAmount = newData[2][1].data;
      var amountTokenA = newData[3][1].data;
      var amountTokenB = newData[4][1].data;
      var liquidity = newData[5][1].data;

      console.log("coverAmount: ", coverAmount);
      console.log("amountTokenA: ", amountTokenA);
      console.log("amountTokenB: ", amountTokenB);
      console.log("liquidity: ", liquidity);
    } else if (eventName == "LiquidityRemoved") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var amountWcspr = newData[2][1].data;
      var amountScspr = newData[3][1].data;

      console.log("amountWcspr: ", amountWcspr);
      console.log("amountScspr: ", amountScspr);
    } else if (eventName == "SendFeesToMaster") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var amountWcspr = newData[2][1].data;
      var masterAddress = splitdata(newData[3][1].data);

      console.log("amountWcspr: ", amountWcspr);
      console.log("masterAddress: ", masterAddress);
    } else if (eventName == "LiquidityAdded") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);
      console.log(newData[4][0].data + " = " + newData[4][1].data);

      var amountWcspr = newData[2][1].data;
      var amountScspr = newData[3][1].data;
      var liquidity = newData[4][1].data;

      console.log("amountWcspr: ", amountWcspr);
      console.log("amountScspr: ", amountScspr);
      console.log("liquidity: ", liquidity);
    } else if (eventName == "MasterProfit") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var amountWcspr = newData[2][1].data;
      var masterAddress = splitdata(newData[3][1].data);

      console.log("amountWcspr: ", amountWcspr);
      console.log("masterAddress: ", masterAddress);
    } else if (eventName == "SendArbitrageProfitToMaster") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var amountWcspr = newData[2][1].data;
      var masterAddress = splitdata(newData[3][1].data);

      console.log("amountWcspr: ", amountWcspr);
      console.log("masterAddress: ", masterAddress);
    }
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      err: error,
    });
  }
});
module.exports = router;
