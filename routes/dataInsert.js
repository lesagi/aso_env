var express = require("express"),
request = require("request"),
iosApp  = require("../models/iosApp.js"),
functions = require("../functions"),
app = express();

var router = express.Router();

function arrToSubArrays(arr,limit){
    var bigArr = [];
    
    arr.forEach(function(el,i){
		if(i%limit === 0){
			bigArr.push([]);
		}
        var bigArrPosition = Math.floor(i/limit);
        bigArr[bigArrPosition].push(el);
    });
    return bigArr;
}

function addKeysToApp(mmpId, keywords, country, limit){
    var convertedArr = [];
    
    // If the input is not empty, than it will try to convert the csv string to an array
    if(keywords){
        var keywords = keywords.split(',');
        
        // break apart the big arr to two-dimensional array
        convertedArr = arrToSubArrays(keywords, limit);
        
        // for each sub-array, it converts it's content back to string and add it to Mobile Action through API
        convertedArr.forEach(function(subArr){
            var URL = "https://api.mobileaction.co/keywords/" + mmpId + "/" + country +"?keywords=" + subArr.toString() + "&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28"
            request.post({
              headers: {'content-type' : 'application/x-www-form-urlencoded'},
              url:     URL
            }, function(err, response, body){
              if(err){
                  console.log(err)
              } else {
                  console.log(body);
              }
            });
        });
    } else {
        console.log("routes/dataInsert.js Err:");
        console.log("no keywords to add");
    }
}

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
    // This is run in a callback once the request is done.    
    var apps = functions.sortAppByOS(JSON.parse(body));
      res.render("dataInsertDir/index",{apps:apps}); 
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
    
    addKeysToApp(req.body.mmpId, req.body.keywords, req.body.country, 200); 
   
    
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

