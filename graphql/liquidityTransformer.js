const {
  getOrCreateGlobal,
  createUser,
  ZERO,
  ONE,
  csprVal,
} = require("./shared");
const { GraphQLString } = require("graphql");

const User = require("../models/user");
const Reservation = require("../models/reservation");
const UserReservationDay = require("../models/userReservationDay");
const GlobalReservationDay = require("../models/globalReservationDay");
const GlobalReservationDaySnapshot = require("../models/globalReservationDaySnapshot");
const ReservationReferral = require("../models/reservationReferral");
const Transaction = require("../models/transaction");

const Response = require("../models/response");
const { responseType } = require("./types/response");

let CM_REFERRER_THRESHOLD = csprVal(50);

let NORMAL_SUPPLY = csprVal(5000000);
let MAX_SUPPLY = NORMAL_SUPPLY + NORMAL_SUPPLY;
let MIN_SUPPLY_1 = csprVal(4500000);
let MIN_SUPPLY_2 = csprVal(4000000);
let MIN_SUPPLY_3 = csprVal(3500000);
let MIN_SUPPLY_4 = csprVal(3000000);
let MIN_SUPPLY_5 = csprVal(2500000);
let MIN_SUPPLY_6 = csprVal(1);

function getMinSupply(day) {
  let dayVal = day / 1000000000;
  switch (dayVal) {
    case 8:
    case 10:
      return MIN_SUPPLY_1;
    case 14:
    case 16:
    case 17:
      return MIN_SUPPLY_2;
    case 21:
    case 23:
    case 25:
      return MIN_SUPPLY_3;
    case 29:
    case 31:
      return MIN_SUPPLY_4;
    case 35:
    case 36:
    case 38:
      return MIN_SUPPLY_5;
    case 12:
    case 19:
    case 26:
    case 33:
    case 40:
    case 42:
    case 44:
    case 46:
    case 47:
    case 48:
      return MIN_SUPPLY_6;
    default:
      return NORMAL_SUPPLY;
  }
}

async function upsertTransaction(
  txdeployhash,
  blocknumber,
  blocktimestamp,
  txfrom
) {
  let transaction = await Transaction.findOne({ id: txdeployhash });
  if (transaction == null) {
    let newData = new Transaction({
      id: txdeployhash,
      blockNumber: blocknumber,
      timestamp: blocktimestamp,
      sender: txfrom,
      referral: null,
    });
    await Transaction.create(newData);
  }
  return transaction;
}

const handleReferralAdded = {
  type: responseType,
  description: "Handle Referral Added",
  args: {
    refundedTo: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let global = getOrCreateGlobal();

      let transaction = upsertTransaction(event.transaction, event.block);

      let referrerID = event.params.referral.toHexString();
      let referrer = User.load(referrerID);
      if (referrer == null) {
        referrer = createUser(referrerID);
        global.userCount = global.userCount.plus(ONE);
      }
      // TODO refactor more == and maybe other operators
      if (referrer.reservationReferralCount.equals(ZERO)) {
        global.reservationReferrerCount =
          global.reservationReferrerCount.plus(ONE);
      }

      let refereeID = event.params.referee.toHexString();
      let referee = User.load(refereeID);
      if (referee == null) {
        referee = createUser(refereeID);
        global.userCount = global.userCount.plus(ONE);
      }
      let reservedEffectiveEth = event.params.amount
        .times(BigInt.fromI32(11))
        .div(BigInt.fromI32(10));
      referee.reservationActualWei = referee.reservationActualWei
        .plus(event.params.amount)
        .minus(reservedEffectiveEth);
      global.reservationActualWei = global.reservationActualWei
        .plus(event.params.amount)
        .minus(reservedEffectiveEth);
      referee.save();

      let referralID = event.transaction.hash.toHexString();
      let referral = new ReservationReferral(referralID);
      referral.transaction = transaction.id;
      referral.timestamp = transaction.timestamp;
      referral.referrer = referrer.id;
      referral.referee = referee.id;
      referral.actualWei = event.params.amount;
      referral.save();

      let wasBelowCm =
        referrer.reservationReferralActualWei < CM_REFERRER_THRESHOLD;
      referrer.reservationReferralActualWei =
        referrer.reservationReferralActualWei.plus(referral.actualWei);
      referrer.reservationReferralCount =
        referrer.reservationReferralCount.plus(ONE);
      if (
        wasBelowCm &&
        referrer.reservationReferralActualWei >= CM_REFERRER_THRESHOLD &&
        referrer.cmStatus === false
      ) {
        referrer.cmStatus = true;
        referrer.cmStatusInLaunch = true;
        global.cmStatusCount = global.cmStatusCount.plus(ONE);
        global.cmStatusInLaunchCount = global.cmStatusInLaunchCount.plus(ONE);
      }
      referrer.save();
      global.save();

      transaction.referral = referral.id;
      transaction.save();

      //let resList = new Array<Reservation | null>();
      let resList;
      let txHash = event.transaction.hash.toHexString();
      for (let i = 1; i <= 50; i++) {
        let resID = txHash + "-" + i.toString();
        let reservation = Reservation.load(resID);
        if (reservation != null) {
          resList.push(reservation);
          // TODO populate reservation.referral and save?  Too costly?
        }
      }

      let nRes = BigInt.fromI32(resList.length);
      let dayActualWei = referral.actualWei.div(nRes);
      let remainder = referral.actualWei.mod(nRes);
      for (let i = 0; i < resList.length; i++) {
        let actualWei = i === 0 ? dayActualWei.plus(remainder) : dayActualWei;

        let res = resList[i];
        res.actualWei = actualWei;
        res.save();

        let uResDay = UserReservationDay.load(
          res.user + "-" + res.investmentDay.toString()
        );
        uResDay.actualWei = uResDay.actualWei
          .plus(res.actualWei)
          .minus(res.effectiveWei);
        uResDay.save();

        let gResDay = GlobalReservationDay.load(res.investmentDay.toString());
        gResDay.actualWei = gResDay.actualWei
          .plus(res.actualWei)
          .minus(res.effectiveWei);
        gResDay.save();

        let gResDaySnapshot = new GlobalReservationDaySnapshot(
          res.investmentDay.toString() + "-" + event.block.timestamp.toString()
        );
        gResDaySnapshot.actualWei = gResDay.actualWei;
        gResDaySnapshot.save();
      }
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
const handleWiseReservation = {
  type: responseType,
  description: "Handle Wise Reservation",
  args: {
    refundedTo: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let global = getOrCreateGlobal();
      global.reservationCount = global.reservationCount.plus(ONE);

      let transaction = upsertTransaction(event.transaction, event.block);

      let userID = event.transaction.from.toHexString();
      let user = User.load(userID);
      if (user == null) {
        user = createUser(userID);
        global.userCount = global.userCount.plus(ONE);
      }
      if (user.reservationCount == ZERO) {
        global.reserverCount = global.reserverCount.plus(ONE);
      }

      let reservationID =
        event.transaction.hash.toHexString() +
        "-" +
        event.params.investmentDay.toString();
      let reservation = new Reservation(reservationID);
      reservation.transaction = transaction.id;
      reservation.timestamp = transaction.timestamp;
      reservation.user = user.id;
      reservation.investmentDay = event.params.investmentDay;
      reservation.effectiveWei = event.params.amount;
      reservation.actualWei = event.params.amount;
      reservation.referral = null;
      reservation.save();

      user.reservationCount = user.reservationCount.plus(ONE);
      user.reservationEffectiveWei = user.reservationEffectiveWei.plus(
        reservation.effectiveWei
      );
      user.reservationActualWei = user.reservationActualWei.plus(
        reservation.effectiveWei
      );
      global.reservationEffectiveWei = global.reservationEffectiveWei.plus(
        reservation.effectiveWei
      );
      global.reservationActualWei = global.reservationActualWei.plus(
        reservation.effectiveWei
      );
      global.save();

      let gResDayID = reservation.investmentDay.toString();
      let gResDay = GlobalReservationDay.load(gResDayID);
      if (gResDay == null) {
        gResDay = new GlobalReservationDay(gResDayID);
        gResDay.investmentDay = reservation.investmentDay;
        gResDay.minSupply = getMinSupply(gResDay.investmentDay);
        gResDay.maxSupply = MAX_SUPPLY.minus(gResDay.minSupply);
        gResDay.effectiveWei = ZERO;
        gResDay.actualWei = ZERO;
        gResDay.reservationCount = ZERO;
        gResDay.userCount = ZERO;
      }
      gResDay.effectiveWei = gResDay.effectiveWei.plus(
        reservation.effectiveWei
      );
      gResDay.actualWei = gResDay.actualWei.plus(reservation.effectiveWei);
      gResDay.reservationCount = gResDay.reservationCount.plus(ONE);

      let gResDaySnapshotID =
        reservation.investmentDay.toString() +
        "-" +
        event.block.timestamp.toString();
      let gResDaySnapshot = new GlobalReservationDaySnapshot(gResDaySnapshotID);
      gResDaySnapshot.timestamp = event.block.timestamp;
      gResDaySnapshot.investmentDay = gResDay.investmentDay;
      gResDaySnapshot.effectiveWei = gResDay.effectiveWei;
      gResDaySnapshot.actualWei = gResDay.actualWei;
      gResDaySnapshot.reservationCount = gResDay.reservationCount;

      let uResDayID = userID + "-" + reservation.investmentDay.toString();
      let uResDay = UserReservationDay.load(uResDayID);
      if (uResDay == null) {
        uResDay = new UserReservationDay(uResDayID);
        uResDay.user = user.id;
        uResDay.investmentDay = reservation.investmentDay;
        uResDay.effectiveWei = ZERO;
        uResDay.actualWei = ZERO;
        uResDay.reservationCount = ZERO;
        gResDay.userCount = gResDay.userCount.plus(ONE);
        user.reservationDayCount = user.reservationDayCount.plus(ONE);
      }
      uResDay.effectiveWei = uResDay.effectiveWei.plus(
        reservation.effectiveWei
      );
      uResDay.actualWei = uResDay.actualWei.plus(reservation.effectiveWei);
      uResDay.reservationCount = uResDay.reservationCount.plus(ONE);
      uResDay.save();

      gResDay.save();

      user.save();

      gResDaySnapshot.userCount = gResDay.userCount;
      gResDaySnapshot.save();
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
const handleGeneratedStaticSupply = {
  type: responseType,
  description: "Handle Generated Static Supply",
  args: {
    investmentDay: { type: GraphQLString },
    staticSupply: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let newData = new GlobalReservationDay({
        id: args.investmentDay,
        supply: args.staticSupply,
      });
      await GlobalReservationDay.create(newData);

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

const handleGeneratedRandomSupply = {
  type: responseType,
  description: "Handle Generated Random Supply",
  args: {
    investmentDay: { type: GraphQLString },
    randomSupply: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      let newData = new GlobalReservationDay({
        id: args.investmentDay,
        supply: args.randomSupply,
      });
      await GlobalReservationDay.create(newData);

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
  handleReferralAdded,
  handleWiseReservation,
  handleGeneratedStaticSupply,
  handleGeneratedRandomSupply,
};
