var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
  },
  transactions: {
    type: String,
  },
  reservations: {
    type: String,
  },
  reservationDays: {
    type: String,
  },
  reservationEffectiveWei: {
    type: String,
  },
  reservationActualWei: {
    type: String,
  },
  reservationCount: {
    type: String,
  },
  reservationDayCount: {
    type: String,
  },
  reservationReferrals: {
    type: String,
  },
  reservationReferralActualWei: {
    type: String,
  },
  reservationReferralCount: {
    type: String,
  },
  stakes: {
    type: String,
  },
  stakeReferrals: {
    type: String,
  },
  stakeCount: {
    type: String,
  },
  cmStatus: {
    type: Boolean,
  },
  cmStatusInLaunch: {
    type: Boolean,
  },
  gasRefunded: {
    type: String,
  },
  refundTransaction: {
    type: String,
  },
});

var user = mongoose.model("user", userSchema);
module.exports = user;
