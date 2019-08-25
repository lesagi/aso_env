"use strict";

var express = require("express"),
    functions = require("../functions"),
    request = require("request"),
    app = express();

var router = express.Router();

// =====================
// API Link Creator
// =====================


function getAppListFromMobileAction() {
    return new Promise(function (resolve, reject) {
        var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
        request(URL, function (err, res, body) {
            if (!err) {
                resolve(JSON.parse(body));
            } else {
                reject("App fetching from MA failed for the following: ", err);
            }
        });
    });
}

router.get('/', function (req, res) {
    getAppListFromMobileAction().then(function (apps) {
        res.render("API/index", { apps: functions.sortAppByOS(apps) });
    }, function (err) {
        console.error("Operation failed", err);
        res.redirect("/");
    });
});

module.exports = router;