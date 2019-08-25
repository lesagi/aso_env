var express = require("express"),
    request = require("request"),
    app = express();


var apiRequestHandler = {};

const parseRes = res => {
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
    return keysObj;
}

apiRequestHandler.getAppKeysInMa = (appId, country) => {
    return new Promise((resolved, rejected) => {
        var url = 'https://api.mobileaction.co/keywords/'+ appId +'/' + country + '?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28';
        apiRequestHandler.makeApiCall(url)
        .then(res => resolved(parseRes(res)))
        .catch(err => console.log(err))
    });
};

apiRequestHandler.makeApiCall = (url) => 
    new Promise((resolved, rejected) => {
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                resolved(JSON.parse(body));
            } else {
                rejected(error);
            }
        });
    });

module.exports = apiRequestHandler;