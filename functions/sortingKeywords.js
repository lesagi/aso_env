var express = require("express"),
Keyword = require("../models/keyword.js"),
blackKeyword = require("../models/blackKey.js"),
functions = require("../functions"),
request = require("request"),
app = express();

var sortingKeywords = {}; // The main variable that is exported from this file. Contains all the funcitons.
// Create a new keywords into the Keywords Collection in the DB
sortingKeywords.addKeyToKeywordsCollection = function(obj){
    var newKey = {
        keyword: obj.keyword,
        updates:[{
            traffic: Math.round(obj.searchVolume),
            difficulty: Math.round(obj.ownIphoneChance),
            competition: obj.numberOfIphoneApps,
        }]
    };
    Keyword.create(newKey, function(err, keyword){
        if(err){
            console.log(err);
        } else {
            // console.log("createKey function");
            // console.log(keyword);
        }
    });
}

// Create a new keywords into the blackListKeyword Collection in the DB
sortingKeywords.addKeyToblackListKeywordsCollection = function(keyword, err){
    if(!err){
        blackKeyword.create({keyword:keyword}, function(err, keyword){
            if(err){
                console.log(err);
            } else {
                // console.log("createKey function");
                // console.log(keyword);
            }
        });
    } else {
        console.log("Could not add a keyword to the blacklist due the following error:");
        console.log(err);
    }
    
}

sortingKeywords.isKeyMeetRequirements = function(obj){
    var traffic = obj.searchVolume;
    if(traffic>0){ // can add requirements dynamically in the IF STATEMENT
        return true;
    } else {
        return false;
    }
}



sortingKeywords.sortVerifiedPhrase = function(phrase, c) {
    // var searchTerm = phrase[0].keyword;
    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+phrase;
    // console.log(URL);
    // console.log("--------------------------------------------------");
    request(URL, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            // console.log("The keyword: \"" + phrase + "\" has been checked");
            var keyword = JSON.parse(body);
            if(sortingKeywords.isKeyMeetRequirements(keyword)){
                
                sortingKeywords.addKeyToKeywordsCollection(keyword);
            } else {
                // console.log("doesn't meet rquirement");
                console.log(keyword);
                sortingKeywords.addKeyToblackListKeywordsCollection(phrase);
            }
        } else {
            // if(response.statusCode == 429){
            //     console.log("too many requests");
            //     callback(error,phrase,c++);
            // }
            // console.log("Sending the following keyword: --" + phrase + "-- has failed.");
            // console.log("status code: " + response.statusCode);
            console.log(phrase);
            console.log("status message: " + response.statusMessage);
            // console.log(response);
            // console.log("Error: " + error);
            
        }

    });
};

sortingKeywords.sortVerifiedPhrases = function(phrases){
    phrases.forEach(function(phrase){
       sortingKeywords.sortVerifiedPhrase(phrase);
    });   
}

sortingKeywords.checkIfPhraseInKeywordsCollection = function(keyword, cb){
    Keyword.find({keyword:keyword},function(err,keyword){
        if(!err){
            if(keyword.length>0){
               cb(err,true);
           } else {
               cb(err,false);
           }
        } else {
            console.log("checkIfPhraseInKeywordsCollection: ");
            console.log(err);
        }
    });
};

function callback(err,keyword,c){
    if(!err){
        setTimeout(function(){sortingKeywords.sortVerifiedPhrase(keyword, c)},c*2000);
    } else {
        console.log("callback of keywords function: ");
        console.log(err);
    }
}


//Checks if a specific keywords existed in the black list or not
function isInBlacklist(keyword, callback){ 
    blackKeyword.find({keyword:keyword},function(err,foundKeyword){
        if(foundKeyword.length>0){
            callback(err,true);
        } else {
            callback(err,false);
        }
    });
}



sortingKeywords.sortNewPhrases = function(phrases){
    var c = 0;
    phrases.forEach(function(keyword){
        // the call back function will set the value of "inBlacklist" to false or true if the keyword is in the DB or not accordingly
        isInBlacklist(keyword,function(err,inBlacklist){
            if(!err && !inBlacklist){
                Keyword.find({keyword:keyword},function(err,foundKeyword){
                
                    if(!err && foundKeyword.length==0){
                        console.log("c is: " + c);
                        callback(err,keyword,c++);
                    } else {
                        // console.log("already exists: ");
                        // console.log(foundKeyword);
                    }
                    
                });
            } else if (err) {
                console.log("sortNewPhrases err: ");
                console.log(err);
            } 
        });
    });
    console.log("Process is finished, all Phrases were sorted");
}



sortingKeywords.sleep = function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function blackCallback(err,keyword,c){
    if(!err){
        setTimeout(function(){sortingKeywords.reSortVerifiedPhrase(keyword, c)},c*2000);
    } else {
        console.log("blackCallback of keywords function: ");
        console.log(err);
    }
}

sortingKeywords.reSortVerifiedPhrase = function(phrase, c) {
    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+phrase;
    request(URL, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var keyword = JSON.parse(body);
            if(sortingKeywords.isKeyMeetRequirements(keyword)){
                blackKeyword.remove({keyword:phrase}, function(err){
                    if(err){
                        console.log("could not remove " + phrase);
                    }
                });
                sortingKeywords.addKeyToKeywordsCollection(keyword);
            } else {
                console.log(keyword);
                sortingKeywords.addKeyToblackListKeywordsCollection(phrase);
            }
        } else {
            console.log(phrase);
            console.log("status message: " + response.statusMessage);
        }
    });
};

//Validate that all black list is really don't meet the requirement OR when requirement is changed, it updates the list
function validateBlacklist(){
    var c=0;
    blackKeyword.find({},function(err, keywords){
        keywords.forEach(function(keyword){
            blackCallback(err, keyword.keyword,c);
            c++;
            console.log(keyword.keyword,c);
        });

    });
}

// validateBlacklist();
module.exports = sortingKeywords;


