"use strict";

var express = require("express"),
    request = require("request"),
    addKeysTo = require("../functions/addKeyTo.js"),
    functions = require("../functions"),
    apiRequestsHandler = require("../functions/apiReqeusts.js"),
    app = express();

var router = express.Router();

router.get('/', function (req, res) {
    var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
    var body = apiRequestsHandler.makeApiCall(URL, function (err, body) {
        if (!err) {
            // This is run in a callback once the request is done.    
            var apps = functions.sortAppByOS(body);
            res.render("wordsInjectionDir/index", { apps: apps });
        } else {
            console.log("routes/wordsInjection.js Err:");
            console.log(err);
        }
    });
});

router.post("/", function (req, res, next) {
    if (req.body.keywords.length != 0 && req.body.country != undefined) {
        addKeysTo.mobileAction(req.body.mmpId, req.body.keywords.split(/[\W]*\,[\W]*/gim), [].concat(req.body.country));
    }
    res.redirect("back");
});

module.exports = router;