var express         = require("express"),
request             = require("request"),
functions           = require("../functions"),
addKeyTo            = require("../functions/addKeyTo.js"),
app = express();

var sortKeys = {}; // The main variable that is exported from this file. Contains all the functions.

sortKeys.isKeyMeetRequirements = function(obj){
    var traffic = obj.searchVolume;
    if(traffic>0){ // can add requirements dynamically in the IF STATEMENT
        return true;
    } else {
        return false;
    }
}


sortKeys.sortVerifiedPhrase = function(phrase, c, storeId) {
    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+phrase;
    request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
            var keyword = JSON.parse(body);
            if(sortKeys.isKeyMeetRequirements(keyword)){
                addKeyTo.keywordsCollection(keyword, storeId);
            } else {
                // console.log("doesn't meet rquirement");
                // console.log(keyword);
                addKeyTo.blackKeysCollection(keyword);
            }
        } else {
            // if(response.statusCode == 429){
            //     console.log("too many requests");
            //     callback(error,phrase,c++);
            // }
            // console.log("Sending the following keyword: --" + phrase + "-- has failed.");
            // console.log("status code: " + response.statusCode);
            console.log("sortKeys.js Functions file - sortVerifiedPhrase function error:");
            console.log(err);
            console.log(phrase);
            // console.log("status message: " + response.statusMessage);
            // console.log(response);
            // console.log("Error: " + error);
        }
    });
};


sortKeys.sortVerifiedPhrases = function(phrases){
    phrases.forEach(function(phrase){
       sortKeys.sortVerifiedPhrase(phrase);
    });   
}


sortKeys.checkIfPhraseInKeywordsCollection = function(keyword, cb){
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


function callback(err,keyword,c, storeId){
    if(!err){
        setTimeout(function(){sortKeys.sortVerifiedPhrase(keyword, c, storeId)},c*1000);
    } else {
        console.log("callback of keywords function: ");
        console.log(err);
    }
}


//Checks if a specific keywords existed in the black list or not
sortKeys.isInBlacklist = function(keyword, callback){ 
    blackKeyword.find({keyword:keyword},function(err,foundKeyword){
        if(foundKeyword.length>0){
            callback(err,true);
        } else {
            callback(err,false);
        }
    });
}


// var promise = new Promise(function(resolve, reject) {
//   resolve(1);
// });

// promise.then(function(val) {
//   console.log(val); // 1
//   return val + 2;
// }).then(function(val) {
//   console.log(val); // 3
// })


sortKeys.sortNewPhrases = function(phrases, storeId){
    var c = 0;
    phrases.forEach(function(keyword){
        // the call back function will set the value of "inBlacklist" to true or false if the keyword is in the DB or not accordingly
        sortKeys.isInBlacklist(keyword,function(err,inBlacklist){
            if(!err && !inBlacklist){
                Keyword.findOne({keyword:keyword},function(err,foundKeyword){
                    if(!err && !foundKeyword){
                        callback(err,keyword,c++,storeId);
                    } else if (storeId && foundKeyword){
                        setTimeout(addKeyTo.appKeysArray(foundKeyword,storeId),0);
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
}


sortKeys.sleep = function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function blackCallback(err,keyword,c){
    if(!err){
        setTimeout(function(){sortKeys.reSortVerifiedPhrase(keyword, c)},c*1000);
    } else {
        console.log("blackCallback of keywords function: ");
        console.log(err);
    }
}


sortKeys.reSortVerifiedPhrase = function(phrase, c) {
    
    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+phrase;
    request(URL, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var keyword = JSON.parse(body);
            if(sortKeys.isKeyMeetRequirements(keyword)){
                blackKeyword.remove({keyword:phrase}, function(err){
                    if(err){
                        console.log("could not remove " + phrase);
                    }
                });
                addKeyTo.keywordsCollection(keyword);
            } else {
                console.log("sortKeys.reSortVerifiedPhrase err:");
                console.log(keyword);
               addKeyTo.blackKeysCollection(phrase);
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
            console.log("sortingKeywors file, validateBlacklist");
            console.log(keyword.keyword,c);
        });

    });
}


sortKeys.sortVerifiedPhraseFromAppApi = function(keyword, storeId, delayTimeOut) {
    console.log(delayTimeOut)
    if(keyword.traffic !== -1){
        setTimeout(function(){
            if(sortKeys.isKeyMeetRequirements(keyword)){
                addKeyTo.keywordsCollection(keyword, storeId);
            } else {
                // console.log("doesn't meet rquirement");
                // console.log(keyword);
                addKeyTo.blackKeysCollection(keyword);
            }
        },delayTimeOut*100);
    } else {
        
    }
    
};


// the function is dedicated for sorting phrases that were retrieved from the APP API.
// This way, the system get a bunch of keywords at one time
sortKeys.sortNewPhrasesFromAppApi = function(phrases, storeId){
    var delayTimeOut = 0;
    sortKeys.fromAppApi(phrases, storeId);
    // phrases.forEach(function(keyword, i){
    //     var term = keyword.keyword;
    //     // the call back function will set the value of "inBlacklist" to false or true if the keyword is in the DB or not accordingly
    //     sortKeys.isInBlacklist(term,function(err,inBlacklist){
    //         if(!err && !inBlacklist){
    //             Keyword.findOne({keyword:term},function(err, foundKeyword){
    //                 if(!err && !foundKeyword){
    //                     sortKeys.sortVerifiedPhraseFromAppApi(keyword, storeId, delayTimeOut++);
    //                 } else {
    //                     // console.log("already exists: ");
    //                     // console.log(foundKeyword);
    //                 }
                    
    //                 // Either the word exists in the Db or not, it needs to be checked and added to an app array if required
    //                 if (storeId!==null){
    //                     addKeyTo.appKeysArray(foundKeyword,storeId);
    //                 }
    //             });
    //         } else if (err) {
    //             console.log("sortNewPhrases err: ");
    //             console.log(err);
    //         } 
    //     });
    // });
}


// validateBlacklist();
module.exports = sortKeys;


// function excludeBlacked(phrases, storeId){
//     phrases.forEach(function(keyword, i){
//         var term = keyword;
//         // the call back function will set the value of "inBlacklist" to false or true if the keyword is in the DB or not accordingly
//         blackKeyword.findOne({keyword:term},function(err,key){
//             if(!err){
//                 if(key){
//                     phrases.splice(phrases.indexOf(term),1);
//                 }
//             }
            
//             if (i == phrases.length-1){
//                 excludeWhites(phrases)
//             }
//         });
//     });
// }

// Using this function will allow you to get back only keywords that aren't existed in the "White list"
// and these keywords only would be sent over to keep processing


function addKeysArrToKeywordsCollection(phrases, storeId){
    phrases.forEach(function(keyword){
        addKeyTo.keywordsCollection(keyword, storeId);
    });
}

function sortKeysOfWhiteArray(phrases, storeId, callback){
    // Create a new array to gather all the leftovers = the keywords that aren't existed yet
    var cleanArr = [];
    
    // Go over the passed arr argument, and add the keywords that aren't existed to the cleanArr
    phrases.forEach(function(keyword,i){
        var term = keyword.keyword;
        // the call back function will set the value of "inBlacklist" to false or true if the keyword is in the DB or not accordingly
        Keyword.findOne({keyword:term},function(err,key){
            if(!err){
                if(!key){
                    cleanArr.push(keyword);
                }
            }
            
            // Send the leftovers to be added to the DB over the callback function
            // when i == phrases.length-1 that means that the sorting is over.
            // All phrases were checked
            if (i == phrases.length-1){
                callback(cleanArr, storeId)
            }
        });
    });
}


function addKeysArrToBlackKeysCollection(phrases, storeId){
    phrases.forEach(function(keyword){
        addKeyTo.blackKeysCollection(keyword, storeId);
    });
}

function sortKeysOfBlackArray(phrases, storeId, callback){
    // Create a new array to gather all the leftovers = the keywords that aren't existed yet
    var cleanArr = [];
    
    // Go over the passed arr argument, and add the keywords that aren't existed to the cleanArr
    phrases.forEach(function(keyword,i){
        var term = keyword.keyword;
        // the call back function will set the value of "inBlacklist" to false or true if the keyword is in the DB or not accordingly
        blackKeyword.findOne({keyword:term},function(err,key){
            if(!err){
                if(!key){
                    cleanArr.push(keyword);
                }
            }
            
            // Send the leftovers to be added to the DB over the callback function
            // when i == phrases.length-1 that means that the sorting is over.
            // All phrases were checked
            if (i == phrases.length-1){
                callback(cleanArr, storeId)
            }
        });
    });
}


sortKeys.fromAppApi = function(keyObjArr, storeId){
    var whites = [],
    blacks = [],
    invalids = [];
    keyObjArr.forEach(function(keyObj){
        if(keyObj.searchVolume == -1) {
            invalids.push(keyObj);
        } else if (sortKeys.isKeyMeetRequirements(keyObj)){
            whites.push(keyObj);
        } else {
            blacks.push(keyObj);
        }
    });
    
    console.log(whites);
    // var followingFunction = {
    //     execute: sortKeysOfBlackArray(blacks, storeId, addKeysArrToBlackKeysCollection),
    //     arr: blacks,
    //     nextFunc: addKeysArrToBlackKeysCollection
    // }
    sortKeysOfWhiteArray(whites, storeId, addKeysArrToKeywordsCollection);
    // setTimeout(sortKeysOfBlackArray(blacks, storeId, addKeysArrToBlackKeysCollection), 0);
}

