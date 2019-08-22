var express = require("express"),
    request = require("request"),
    convertFromTo = require("../functions/convertFromTo.js"),
    RateLimiter = require('request-rate-limiter'),
    rp = require('request-promise'),
    makeRequests = require('../lib/index'),
    app = express();


var addKeyTo = {

    // The "appstore-keyword-ranking" api call returns slightly different keys for the keywords objects
    // such as "chance" (Stands for "traffic") instead of "ownIphoneChance"
    // In order to be able to use this function to sort keywords from this kind of API, the function checks the structure of the keyword
    // object arg, that is passed to the it.
    // API: https://www.mobileaction.co/docs/api#appstore-keyword-ranking

    // if "ownIphoneChance" is one of the object keys, that means it was transferred from the "AppStore Keyword Metadata" API
    // https://www.mobileaction.co/docs/api#appstore-keyword-metadata
    mobileAction: function(mmpId, keywords, country) {
        var limit = 200;
        if(country != "US")
            limit = 100;
        
        var urls = createURLs(mmpId, keywords, country, limit);
        makeRequests.sendData(urls);
        // fireRequest(urls);
    }

}


function createURLs(mmpId, keywords, country, limit){
    
    var urls = [];
    if (keywords) { // If the input is not empty, than it will try to convert the csv string to array
        var keywords = keywords.split(',');
        
        var convertedArr = convertFromTo.arrToSubArrays(keywords, limit); // break apart the big arr to two-dimensional array
        let c = 0;
        while(convertedArr.length>0){
            var words = convertedArr.pop();
            let encodedWords = encodeURIComponent(words.toString());
            console.log(encodedWords);
            var URL = "https://api.mobileaction.co/keywords/" + mmpId + "/" + country + "?keywords=" + encodedWords + "&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
            urls.push(URL);
        }
    }
    
    return urls;
}




function fireRequest(urls){
    
    var URL = urls.pop();
    console.log(URL);
    var limiter = new RateLimiter({
          rate: 5               // requests per interval,
                                // defaults to 60
        , interval: 60          // interval for the rate, x
                                // requests per interval,
                                // defaults to 60
        , backoffCode: 429      // back off when this status is
                                // returned, defaults to 429
        , backoffTime: 30       // back off for n seconds,
                                // defauts to rate/5
        , maxWaitingTime: 180   // return errors for requests
                                // that will have to wait for
                                // n seconds or more. defaults
                                // to 5 minutes
    });
    
    while(typeof(URL) != "undefined" && urls.length!=0){
        limiter.request({headers: { 'content-type': 'application/x-www-form-urlencoded','charset': 'utf-8'}, url: URL, method    : 'post'})
        .then(function(response){
            //if(response.statusCode != 200) urls.push(URL);
            console.log(response.statusCode);
            // console.log("success");
        })
        .catch(function(err){
            urls.unshift(URL);
            console.log(err);
        });
        URL = urls.pop();
    }
    console.log("DONE");
}

// Make sure that the keyword is not already existed in the array
function isKeyInArray(arr, keyword) {
    var isFound = false;
    arr.forEach(function(el) {
        if (el.keyword === keyword) {
            isFound = true;
        }
    });
    return isFound;
}



module.exports = addKeyTo;





// async function fireRequest(URL){
//     // console.log(URL + "\n");
//     // Set the headers
//     var headers = {
//         'content-type': 'application/x-www-form-urlencoded',
//         'charset': 'utf-8'
//     }
    
    
//     // Configure the request
//     var options = {
//         url: "https://api.mobileaction.co/keywords/323722/US?keywords=hello&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28",
//         method: 'POST',
//         headers: headers
//     }
    

//     return rp({url:URL,headers:headers})
//             .then((res)=>{
//                 console.log(res);
//                 console.log('code : ',res.statusCode);
//                 console.log('Yay');
//             })
//             .catch((err)=>{
//                 console.log('Error : ',err);
//             });;
//     // (err)=>{
//     //     console.log('error : ',err);
//     // },
//     // (res)=>{
//     //       console.log('code : ',res.statusCode); 
//     // })
//         // if(!err && response.statusCode == 200){
//             console.log('-------------------------');
//             // console.log(response.statusCode);
//             //console.log(body);
//             // return true;
            
//         // } 
//         //else
//         // return false;

// }