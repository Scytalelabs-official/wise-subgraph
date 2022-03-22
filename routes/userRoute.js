const express = require("express");
const router = express.Router();

router.route("/getWiseBalanceAgainstUser").get(async(req, res, next) =>{
    try {
      if (!req.body.user) {
        return res.status(400).json({
          success: false,
          message: "There is no user specified in the req body.",
        });
      }
      const balance=0;
        return res.status(200).json({
            success: true,
            message: "WISE Balance against user has been Successfully received",
            balance: balance
          });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  });

  module.exports = router;