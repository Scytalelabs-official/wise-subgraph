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
      .post("https://localhost:3001/listener/initiateListener", {
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

    if (eventName == "RefundIssued") {
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
    } else if (eventName == "GiveStatus") {
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
    } else if (eventName == "StakeStart") {
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
    } else if (eventName == "StakeEnd") {
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
    } else if (eventName == "InterestScraped") {
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
    } else if (eventName == "NewGlobals") {
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
    } else if (eventName == "NewSharePrice") {
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
    } else if (eventName == "WiseReservation") {
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
    } else if (eventName == "generated_static_supply") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var investmentDay = newData[2][1].data;
      var staticSupply = newData[3][1].data;

      console.log("investmentDay: ", investmentDay);
      console.log("staticSupply: ", staticSupply);

      console.log("Calling handleGeneratedStaticSupply mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleGeneratedStaticSupply( $investmentDay: String!, $staticSupply: String!){
            handleGeneratedStaticSupply( investmentDay: $investmentDay, staticSupply: $staticSupply) {
                    result
                }
                          
                }`,
        {
          investmentDay: investmentDay,
          staticSupply: staticSupply,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleGeneratedStaticSupply  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (eventName == "generated_random_supply") {
      console.log(eventName + " Event result: ");
      console.log(newData[0][0].data + " = " + newData[0][1].data);
      console.log(newData[1][0].data + " = " + newData[1][1].data);
      console.log(newData[2][0].data + " = " + newData[2][1].data);
      console.log(newData[3][0].data + " = " + newData[3][1].data);

      var investmentDay = newData[2][1].data;
      var randomSupply = newData[3][1].data;

      console.log("investmentDay: ", investmentDay);
      console.log("randomSupply: ", randomSupply);

      console.log("Calling handleGeneratedRandomSupply mutation...");
      request(
        process.env.GRAPHQL,
        `mutation handleGeneratedRandomSupply( $investmentDay: String!, $randomSupply: String!){
            handleGeneratedRandomSupply(investmentDay: $investmentDay, randomSupply: $randomSupply) {
                    result
                }
                          
                }`,
        {
          investmentDay: investmentDay,
          randomSupply: randomSupply,
        }
      )
        .then(function (response) {
          console.log(response);
          return res.status(200).json({
            success: true,
            message: "handleGeneratedRandomSupply  Mutation called.",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
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
