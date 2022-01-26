require("dotenv").config();
var express = require("express");
var router = express.Router();
const axios = require("axios").default;
var { request } = require("graphql-request");
//var pairModel = require("../models/pair");
//var eventsModel = require("../models/events");

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

module.exports = router;
