const express = require("express");
const router = express.Router();
const formedLiquidity = require('../models/formedLiquidity');

router.route("/formedLiquidity").get(async(req, res, next) =>{
    try {
      const formed = await formedLiquidity.find({});
      if (formed == null) {
        return res.status(400).json({
          success: false,
          message: "There is no data in formed liquidity",
        });
      } else {
        return res.send(formed.data);
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