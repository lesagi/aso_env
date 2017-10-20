var express = require("express"),
request = require("request"),
convertFromTo = require("../functions/convertFromTo.js"),
iosApp = require("../models/iosApp.js"),
Keyword = require("../models/keyword.js"),
blackKey = require("../models/blackKey.js"),
invalidKey = require("../models/invalidKey.js"),

app = express();


var addKeyTo = {

// The "appstore-keyword-ranking" api call returns slightly different keys for the keywords objects
// such as "chance" (Stands for "traffic") instead of "ownIphoneChance"
// In order to be able to use this function to sort keywords from this kind of API, the function checks the structure of the keyword
// object arg, that is passed to the it.
// API: https://www.mobileaction.co/docs/api#appstore-keyword-ranking

// if "ownIphoneChance" is one of the object keys, that means it was transferred from the "AppStore Keyword Metadata" API
// https://www.mobileaction.co/docs/api#appstore-keyword-metadata

// Create a new keywords into the Keywords Collection in the DB
keywordsCollection: function(obj, storeId){
    
    if(obj.ownIphoneChance){
        var newKey = {
            keyword: obj.keyword,
            updates:[{
                traffic: Math.round(obj.searchVolume),
                difficulty: Math.round(obj.ownIphoneChance),
                competition: obj.numberOfIphoneApps
            }]
        };
    } else {
        var newKey = {
            keyword: obj.keyword,
            updates:[{
                traffic: Math.round(obj.searchVolume),
                difficulty: Math.round(obj.chance),
                competition: obj.numberOfApps
            }]
        };
    }

    Keyword.create(newKey, function(err, keyword){
        if(err){
            console.log(err);
        } else {
            if(storeId){
                addKeyTo.appKeysArray(keyword,storeId);
            }
            // console.log("createKey function");
            // console.log(keyword);
        }
    });
},

// Create a new keywords into the blackListKeyword Collection in the DB
blackKeysCollection: function(obj, storeId){
    if(obj.ownIphoneChance){
        var newKey = {
            keyword: obj.keyword,
            traffic: Math.round(obj.searchVolume),
            difficulty: Math.round(obj.ownIphoneChance),
            competition: obj.numberOfIphoneApps
        }
    } else {
        var newKey = {
            keyword: obj.keyword,
            traffic: Math.round(obj.searchVolume),
            difficulty: Math.round(obj.chance),
            competition: obj.numberOfApps
        }
    }
    
    blackKey.create(newKey, function(err, keyword){
        if(err){
            console.log(err);
        } else {
            // console.log("createBlackKey function");
            // console.log(keyword);
        }
    });
},


// Create a new keywords into the blackListKeyword Collection in the DB
invalidKeysCollection : function(obj, err){
    if(obj.ownIphoneChance){
        var newKey = {
            keyword: obj.keyword,
            traffic: Math.round(obj.searchVolume),
            difficulty: Math.round(obj.ownIphoneChance),
            competition: obj.numberOfIphoneApps
        }
    } else {
        var newKey = {
            keyword: obj.keyword,
            traffic: Math.round(obj.searchVolume),
            difficulty: Math.round(obj.chance),
            competition: obj.numberOfApps
        }
    }
    
    invalidKey.create(newKey, function(err, keyword){
        if(err){
            console.log(err);
        } else {
            // console.log("createBlackKey function");
            // console.log(keyword);
        }
    });
},


// Add keyword reference to the app array "keywords"
appKeysArray: function(keyword,storeId){
    console.log("----------------");
    console.log(keyword.keyword);
    console.log(storeId);
    iosApp.findOne({"storeId":storeId}).populate("keywords").exec(function(err,foundApp){
        if(!err && !isKeyInArray(foundApp.keywords,keyword.keyword)){
            foundApp.keywords.push(keyword);
            foundApp.save();
        } else {
            console.log("Key is already in the array");
        }
    });
},


mobileAction: function(mmpId, keywords, country, limit, callback){
    var convertedArr = [];
    
    // If the input is not empty, than it will try to convert the csv string to an array
    if(keywords){
        var keywords = keywords.split(',');
        
        // break apart the big arr to two-dimensional array
        convertedArr = convertFromTo.arrToubArrays(keywords, limit);
        
        // for each sub-array, it converts it's content back to string and add it to Mobile Action through API
        convertedArr.forEach(function(subArr){
            var URL = "https://api.mobileaction.co/keywords/" + mmpId + "/" + country +"?keywords=" + subArr.toString() + "&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28"
            request.post({
              headers: {'content-type' : 'application/x-www-form-urlencoded'},
              url:     URL
            }, function(err, response, body){
              if(err){
                  console.log("adding keywords to MA error, addKeyTo.js file");
                  console.log(err)
                  callback();
              } else {
                //   console.log(body);
              }
            });
        });
    } else {
        console.log("routes/dataInsert.js Err:");
        console.log("no keywords to add");
    }
}

}


// Make sure that the keyword is not already existed in the array
function isKeyInArray(arr, keyword){
    var isFound = false;
    arr.forEach(function(el){
        if(el.keyword === keyword){
            isFound = true;
        }
    });
    return isFound;
}


module.exports = addKeyTo;

