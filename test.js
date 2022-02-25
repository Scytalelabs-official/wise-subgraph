require("dotenv").config();
var { request } = require("graphql-request");

async function RefundIssued(refundedTo, amount, deployHash) {
  console.log("Calling handleRefundIssued mutation...");
  let response = await request(
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
  );
  console.log(response);
}

async function CashBackIssued(
  totalCashBack,
  senderAddress,
  senderValue,
  cashBackAmount,
  deployHash
) {
  console.log("Calling handleCashBackIssued mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleCashBackIssued( $totalCashBack:String!,$senderAddress: String!, $senderValue: String!,$cashBackAmount: String!, $deployHash: String!){
            handleCashBackIssued( totalCashBack:$totalCashBack, senderAddress: $senderAddress, senderValue: $ senderValue, cashBackAmount: $ cashBackAmount, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      totalCashBack:totalCashBack,
      senderAddress: senderAddress,
      senderValue: senderValue,
      cashBackAmount: cashBackAmount,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function GiveStatus(referrerId) {
  console.log("Calling handleGiveStatus mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleGiveStatus( $referrerId: String!){
      handleGiveStatus( referrerId: $referrerId) {
              result
          }
                    
          }`,
    {
      referrerId: referrerId,
    }
  );
  console.log(response);
}

async function StakeStart(
  stakerAddress,
  referralAddress,
  referralShares,
  stakeID,
  stakedAmount,
  stakesShares,
  startDay,
  lockDays,
  daiEquivalent
) {
  console.log("Calling handleStakeStart mutation...");
  let response = await request(
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
  );
  console.log(response);
}

async function StakeEnd(stakeID, closeDay, rewardAmount, penaltyAmount) {
  console.log("Calling handleStakeEnd mutation...");
  let response = await request(
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
  );
  console.log(response);
}

async function InterestScraped(
  stakeID,
  scrapeDay,
  scrapeAmount,
  stakersPenalty,
  referrerPenalty
) {
  console.log("Calling handleInterestScraped mutation...");
  let response = await request(
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
  );
  console.log(response);
}

async function NewGlobals(
  totalShares,
  totalStaked,
  shareRate,
  referrerShares,
  currentWiseDay,
  wiseAddress,
  UNISWAP_PAIR
) {
  console.log("Calling handleNewGlobals mutation...");
  let response = await request(
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
  );
  console.log(response);
}

async function NewSharePrice(newSharePrice, oldSharePrice) {
  console.log("Calling handleNewSharePrice mutation...");
  let response = await request(
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
  );
  console.log(response);
}

async function ReferralAdded(
  deployHash,
  blockHash,
  timestamp,
  from,
  referral,
  referee,
  amount
) {
  console.log("Calling handleReferralAdded mutation...");
  let response = await request(
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
      blockHash: blockHash,
      timestamp: timestamp,
      from: from,
      referral: referral,
      referee: referee,
      amount: amount,
    }
  );
  console.log(response);
}

async function WiseReservation(
  deployHash,
  blockHash,
  timestamp,
  from,
  investmentDay,
  amount
) {
  console.log("Calling handleWiseReservation mutation...");
  let response = await request(
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
      blockHash: blockHash,
      timestamp: timestamp,
      from: from,
      investmentDay: investmentDay,
      amount: amount,
    }
  );
  console.log(response);
}

async function startTests() {
  await RefundIssued("123", "10000000000", "123");
  await CashBackIssued("100000000000000000","123", "10000000000","10000000000", "123");
  await GiveStatus("123");
  await StakeStart(
    "123",
    "123",
    "100000000000",
    "123",
    "10000000000",
    "100000000000",
    "15000000000",
    "15000000000",
    "123"
  );
  await StakeEnd("123", "15000000000", "10000000000", "10000000000");
  await InterestScraped(
    "123",
    "15000000000",
    "10000000000",
    "1000000000",
    "1000000000"
  );
  await NewGlobals(
    "100000000000",
    "10000000000",
    "1000000000",
    "100000000000",
    "15000000000",
    "123",
    "123"
  );
  await NewSharePrice("10000000000000", "100000000000");
  await WiseReservation(
    "123",
    "123",
    "123",
    "123",
    "15000000000",
    "10000000000"
  );
  await ReferralAdded("123", "123", "123", "123", "123", "123", "10000000000");
}

startTests();
