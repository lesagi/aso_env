var express = require("express"),
Keyword = require("../models/keyword.js"),
blackKeyword = require("../models/blackKey.js"),
functions = require("../functions"),
request = require("request"),
iosApp  =   require("../models/iosApp.js"),
app = express();

var sortingKeywords = {}; // The main variable that is exported from this file. Contains all the funcitons.
// Create a new keywords into the Keywords Collection in the DB
sortingKeywords.addKeyToKeywordsCollection = function(obj, storeId){
    // The "appstore-keyword-ranking" api call returns slightly different keys for the keywords objects
    // such as "chance" (Stands for "traffic") instead of "ownIphoneChance"
    // In order to be able to use this function to sort keywords from this kind of API, the function checks the structure of the keyword
    // object arg, that is passed to the it.
    // API: https://www.mobileaction.co/docs/api#appstore-keyword-ranking
    
    // if "ownIphoneChance" is one of the object keys, that means it was transferred from the "AppStore Keyword Metadata" API
    // https://www.mobileaction.co/docs/api#appstore-keyword-metadata
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
            if(storeId!==null){
                addKeywordRefToApp(keyword,storeId)
            }
            // console.log("createKey function");
            // console.log(keyword);
        }
    });
}

// Create a new keywords into the blackListKeyword Collection in the DB
sortingKeywords.addKeyToblackListKeywordsCollection = function(obj, err){
    
    // The "appstore-keyword-ranking" api call returns slightly different keys for the keywords objects
    // such as "chance" (Stands for "traffic") instead of "ownIphoneChance"
    // In order to be able to use this function to sort keywords from this kind of API, the function checks the structure of the keyword
    // object arg, that is passed to the it.
    // API: https://www.mobileaction.co/docs/api#appstore-keyword-ranking
    
    // if "ownIphoneChance" is one of the object keys, that means it was transferred from the "AppStore Keyword Metadata" API
    // https://www.mobileaction.co/docs/api#appstore-keyword-metadata
    if(obj.ownIphoneChance!==null){
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
    
    if(!err){
        blackKeyword.create(newKey, function(err, keyword){
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



sortingKeywords.sortVerifiedPhrase = function(phrase, c, storeId) {
    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+phrase;
    request(URL, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var keyword = JSON.parse(body);
            if(sortingKeywords.isKeyMeetRequirements(keyword)){
                sortingKeywords.addKeyToKeywordsCollection(keyword, storeId);
            } else {
                // console.log("doesn't meet rquirement");
                // console.log(keyword);
                sortingKeywords.addKeyToblackListKeywordsCollection(keyword);
            }
        } else {
            // if(response.statusCode == 429){
            //     console.log("too many requests");
            //     callback(error,phrase,c++);
            // }
            // console.log("Sending the following keyword: --" + phrase + "-- has failed.");
            // console.log("status code: " + response.statusCode);
            console.log("sortingKeywords.js Functions file - sortVerifiedPhrase function");
            console.log(phrase);
            // console.log("status message: " + response.statusMessage);
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

function callback(err,keyword,c, storeId){
    if(!err){
        setTimeout(function(){sortingKeywords.sortVerifiedPhrase(keyword, c, storeId)},c*2000);
    } else {
        console.log("callback of keywords function: ");
        console.log(err);
    }
}


//Checks if a specific keywords existed in the black list or not
sortingKeywords.isInBlacklist = function(keyword, callback){ 
    blackKeyword.find({keyword:keyword},function(err,foundKeyword){
        if(foundKeyword.length>0){
            callback(err,true);
        } else {
            callback(err,false);
        }
    });
}



sortingKeywords.sortNewPhrases = function(phrases, storeId){
    var c = 0;
    phrases.forEach(function(keyword){
        // the call back function will set the value of "inBlacklist" to true or false if the keyword is in the DB or not accordingly
        sortingKeywords.isInBlacklist(keyword,function(err,inBlacklist){
            if(!err && !inBlacklist){
                Keyword.findOne({keyword:keyword},function(err,foundKeyword){
                    if(!err && !foundKeyword){
                        callback(err,keyword,c++,storeId);
                    } else if (storeId!==null && foundKeyword){
                        addKeywordRefToApp(foundKeyword,storeId);
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
        console.log("Process is finished, all Phrases were sorted");
    });
        
    
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
                console.log("sortingKeywords.reSortVerifiedPhrase err:");
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
            console.log("sortingKeywors file, validateBlacklist");
            console.log(keyword.keyword,c);
        });

    });
}

sortingKeywords.sortVerifiedPhraseFromAppApi = function(keyword, storeId) {
    console.log(keyword);
    if(sortingKeywords.isKeyMeetRequirements(keyword)){
        sortingKeywords.addKeyToKeywordsCollection(keyword, storeId);
    } else {
        // console.log("doesn't meet rquirement");
        // console.log(keyword);
        sortingKeywords.addKeyToblackListKeywordsCollection(keyword);
    }
};

// the function is dedicated for sorting phrases that were retrieved from the APP API.
// This way, the system get a bunch of keywords at one time
sortingKeywords.sortNewPhrasesFromAppApi = function(phrases, storeId){
    phrases.forEach(function(keyword){
        var term = keyword.keyword;
        // the call back function will set the value of "inBlacklist" to false or true if the keyword is in the DB or not accordingly
        sortingKeywords.isInBlacklist(term,function(err,inBlacklist){
            if(!err && !inBlacklist){
                Keyword.findOne({keyword:term},function(err, foundKeyword){
                    if(!err && !foundKeyword){
                        sortingKeywords.sortVerifiedPhraseFromAppApi(keyword, storeId)
                    } else if (storeId!==null && foundKeyword){
                        addKeywordRefToApp(foundKeyword,storeId);
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


// Add keyword reference to the app array "keywords"
function addKeywordRefToApp(keyword,storeId){
    iosApp.findOne({"storeId":storeId}).populate("keywords").exec(function(err,foundApp){
        if(!isKeyInArray(foundApp.keywords,keyword.keyword,true)){
            foundApp.keywords.push(keyword);
            foundApp.save();
        } else {
            
        }
    });
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

// validateBlacklist();
module.exports = sortingKeywords;






// sortingKeywords.addKeyToKeywordsCollectionFromAppAPI = function(obj){
//     var newKey = {
//         keyword: obj.keyword,
//         updates:[{
//             traffic: Math.round(obj.searchVolume),
//             difficulty: Math.round(obj.chance),
//             competition: obj.numberOfApps
//         }]
//     };
//     Keyword.create(newKey, function(err, keyword){
//         if(err){
//             console.log(err);
//         } else {
//             // console.log("createKey function");
//             // console.log(keyword);
//         }
//     });
// }

// // Create a new keywords into the blackListKeyword Collection in the DB
// sortingKeywords.addKeyToblackListKeywordsCollectionFromAppAPI = function(obj, err){
//     var newKey = {
//         keyword: obj.keyword,
//         traffic: Math.round(obj.searchVolume),
//         difficulty: Math.round(obj.chance),
//         competition: obj.numberOfApps
//     }
//     if(!err){
//         blackKeyword.create(newKey, function(err, keyword){
//             if(err){
//                 console.log(err);
//             } else {
//                 // console.log("createKey function");
//                 // console.log(keyword);
//             }
//         });
//     } else {
//         console.log("Could not add a keyword to the blacklist due the following error:");
//         console.log(err);
//     }
    
// }