var express = require("express"),
    request = require("request"),
    convertFromTo = require("../functions/convertFromTo.js"),
    makeRequests = require('../lib/index'),
    sortKeys = require('../functions/sortingKeywords.js'),
    app = express();


var apiRequestHandler = {};

apiRequestHandler.getAppKeysInMa = function(appId, country, cb) {
    var url = 'https://api.mobileaction.co/keywords/'+ appId +'/' + country + '?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28';
    apiRequestHandler.makeApiCall(url, function(err, res){
        if(!err){
            var keysObj = {
                keywords: [],
                traffic: [],
                chance: [],
                competition: [],
                rank: [],
                change: [],
                combinationKeyword: [],
                appTitleKeyMatch: []
            }
            var keysArr = res['data'];
            for(var el in keysArr){
                keysObj.keywords.push(keysArr[el]['keyword']);
                keysObj.traffic.push(keysArr[el]['searchVolume']);
                keysObj.chance.push(keysArr[el]['chance']);
                keysObj.competition.push(keysArr[el]['numberOfApps']);
                keysObj.rank.push(keysArr[el]['rank']);
                keysObj.change.push(keysArr[el]['change']);
                keysObj.combinationKeyword.push(keysArr[el]['combinationKeyword']);
                keysObj.appTitleKeyMatch.push(keysArr[el]['appTitleKeywordMatch']);
            }
            cb(err, keysObj);
        } else {
            console.log(err);
        }
    });
};

apiRequestHandler.makeApiCall = function(url, cb) {
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            cb(null,JSON.parse(body));
        } else {
            cb(error, null);
        }
    });
};

module.exports = apiRequestHandler;