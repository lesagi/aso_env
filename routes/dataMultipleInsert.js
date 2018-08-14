var express = require("express"),
request = require("request"),
addKeysTo = require("../functions/addKeyTo.js"),
iosApp  = require("../models/iosApp.js"),
functions = require("../functions"),
app = express();

var router = express.Router();



var getAPIresponse = function(url, cb) {
    var request = require('request');
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            // console.log(body); // WORKS PERFECTLY
        } else {
            console.log("Error: "+ error);
        }
        cb(error, body);
    });
};

router.get('/', function (req, res) {
    var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
    var body =  getAPIresponse(URL, function(err, body) {
        if(!err){
            // This is run in a callback once the request is done.    
            var apps = functions.sortAppByOS(JSON.parse(body));
            res.render("dataMultipleInsertDir/index",{apps:apps}); 
        } else {
            console.log("routes/dataMultipleInsert.js Err:");
            console.log(err);
        }
    });
});


router.post("/", function(req,res,next){
    console.log(req.body.keywords);
    console.log(req.body.mmpId);
    // the following query retrieved only apps that have mmpId, meaning existed in MA
    //({mmpId:{$ne: null}},null,{sort:'normalized'},function(err,iosApps)
    var limit = 70;
    if(req.body.country == "US")
        var limit = 180;
    // if(req.body.country == "US")
    //     var limit = 180;
    addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "US", 180);
    addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "gb", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "au", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "br", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ca", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "fr", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "de", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "hk", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "in", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "it", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "jo", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "jp", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "kr", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "mx", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "nl", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ru", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "sg", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "es", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "se", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ch", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "tr", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ar", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "at", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "az", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "bh", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "bd", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "be", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "bg", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "cl", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "cn", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "co", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "hr", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "cz", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "dk", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "do", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ec", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "eg", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ee", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "fi", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "gr", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "hu", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "is", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "id", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ie", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "il", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "kz", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "kw", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "lv", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "lb", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "li", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "lt", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "lu", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "mo", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "my", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "mt", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "nz", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "no", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "om", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "pk", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "pe", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ph", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "pl", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "pt", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "qa", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ro", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "sa", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "sk", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "si", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "za", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "lk", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "tw", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "th", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ua", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ae", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "ve", 100);
addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, "vn", 100);
    next()
    },
    function (req, res) {
        var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
        var body =  getAPIresponse(URL, function(err, body) {
        // This is run in a callback once the request is done.    
        var apps = functions.sortAppByOS(JSON.parse(body));
          res.render("dataMultipleInsertDir/index",{apps:apps});
        }
    );

    // res.redirect("back");
});

module.exports = router;