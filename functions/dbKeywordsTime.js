var express = require("express"),
functions = require("../functions"),
request = require("request"),
app = express();

// UPDATE - a specific keyword by ID
// Adding data of a new day for an existing keyword
// can be called with the following example: updateKeyByDate("hello",new Date("2017-08-28"));
function updateKeyByDate(keyObj,date){
    Keyword.findOne({term:keyObj.term},function(err,foundKeyword){
    var givenDate = date.toDateString();
      if (err){
          console.log(err);
      } else {
          foundKeyword.updates.forEach(function(el){
              if(el.date.toDateString()===givenDate){
                  el.traffic = keyObj.updates.traffic;
                  el.difficulty = keyObj.updates.difficulty;
                  el.competition = keyObj.updates.competition;
                  el.updated = Date.now();
              }
          });
          foundKeyword.save();
          console.log("updateKeyByDate function output: ")
          console.log(foundKeyword);
      }
    });
}

// UPDATE "updates" array - put todays data into the array if doesn't exist already
function updateKeywordsForToday(keywordsArray){
    // the function get an array of keywords and apply a function to check each
    // one individually if it has data for today. if not it adds it to the
    // updates array for each one.
    
}

function getTodayDate(){
    var today = new Date();
    return today.toDateString();
}

function getTommorowDate(){
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toUTCString();
}

// console.log(getTommorowDate());

function createTodayDataForKey(keyword){

    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+keyword;
    request(URL, function(err,res,body){
        var parsedData = JSON.parse(body);
        // var newData = {
        //     traffic: Math.round(parsedData.searchVolume),
        //     difficulty: Math.round(parsedData.ownIphoneChance),
        //     competition: parsedData.numberOfIphoneApps
        // }
        var newData = {
            traffic: 3,
            difficulty: 4,
            competition: 5,
            updated: new Date("2017-09-06").toDateString()
        }
        //That updates the updates array but I still need a find a way to add data instead of replacing it
        Keyword.findOneAndUpdate({term:keyword}, {$set:{updates:newData}},function(err,keyword){
            if(err){
                console.log("updateTodayDataForKey err:");
            } else {
                console.log("success");
            }
        });
    });
}

// ----------------- Check Today's Data For Keyowrd --------------------
//check if there's data for today by using mongo's query functions
function checkTodayData(keyword, cb){
    
    var timestamp = new Date();
    var year = timestamp.getFullYear();
    var month = timestamp.getMonth();
    var day = timestamp.getDate();
    var tomorrow = getTommorowDate();
    var today = new Date(year,month,day);
    
    Keyword.find({term:keyword,"updates.date":{"$gte": today, "$lt": tomorrow}},function(err,keyword){
        if(!err){
            if(keyword.length>0){
               cb(err,true);
           } else {
               cb(err,false);
           }
        } else {
            console.log("isTodayData: ");
            console.log(err);
        }
    });
};

// check if there's data for a sepcific keyword fot today
// if so, isUpdates is set to true, otherwise to false;
checkTodayData("ice",function(err,isUpdated){
    //
    console.log(isUpdated);
});

// --------------------- End of Checking Todays Data for Keyword Function --------------