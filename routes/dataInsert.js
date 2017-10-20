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
            res.render("dataInsertDir/index",{apps:apps}); 
        } else {
            console.log("routes/dataInsert.js Err:");
            console.log(err);
        }
    });
});

// router.get("/", function(req,res){
//     // the following query retrieved only apps that have mmpId, meaning existed in MA
//     //({mmpId:{$ne: null}},null,{sort:'normalized'},function(err,iosApps)
//     iosApp.find({},null,{sort:'normalized'},function(err,iosApps){
//       res.render("dataInsertDir/index", {iosApps:iosApps}); 
//     });
// });

router.post("/", function(req,res){
    // console.log(req.body);
    // find the app to get the Mobile Action Id
    
    addKeysTo.mobileAction(req.body.mmpId, req.body.keywords, req.body.country, 200, function(){
        res.redirect("/");
    }); 
   
    
    // the following query retrieved only apps that have mmpId, meaning existed in MA
    //({mmpId:{$ne: null}},null,{sort:'normalized'},function(err,iosApps)
    var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
    var body =  getAPIresponse(URL, function(err, body) {
    // This is run in a callback once the request is done.    
    var apps = functions.sortAppByOS(JSON.parse(body));
      res.render("dataInsertDir/index",{apps:apps}); 
    });
    // res.redirect("back");
});

module.exports = router;

