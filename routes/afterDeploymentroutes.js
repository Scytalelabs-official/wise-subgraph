require("dotenv").config();
var express = require("express");
var router = express.Router();
const auth = require("../middlewares/auth");
const passport = require("passport");
const verifyAdmin = passport.authenticate("jwt", {
  session: false,
});
var allcontractsDataModel = require("../models/allcontractsData");

router
  .route("/addcontractandpackageHash")
  .post(auth.verifyToken, verifyAdmin, async function (req, res, next) {
    try {
      if (!req.body.contractHash) {
        return res.status(400).json({
          success: false,
          message: "There is no contractHash specified in the req body.",
        });
      }
      if (!req.body.packageHash) {
        return res.status(400).json({
          success: false,
          message: "There is no packageHash specified in the req body.",
        });
      }

      let contractHash = req.body.contractHash.toLowerCase();
      let packageHash = req.body.packageHash.toLowerCase();
      let contractsData = await allcontractsDataModel.findOne({
        contractHash: contractHash,
        packageHash: packageHash,
      });
      if (contractsData == null) {
        var newpair = new allcontractsDataModel({
          contractHash: contractHash,
          packageHash: packageHash,
        });
        await allcontractsDataModel.create(newpair);

        return res.status(200).json({
          success: true,
          message: "Contract and Package Hash are Succefully stored.",
        });
      } else {
        return res.status(406).json({
          success: false,
          message: "These Contract and Package Hash are already stored.",
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
