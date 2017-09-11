var express = require("express"),
Keyword = require("../models/keyword.js"),
functions = require("../functions"),
request = require("request"),
sortPhrasesFunctions = require("../functions/sortingKeywords.js"),
app = express();

var router = express.Router();


// =====================
// Keyword Presentation
// =====================


// INDEX page
router.get("/", function(req,res){
    // createKeyFromAPI("hello");
   Keyword.find({},function(err,allKeywords){
       if (err){
          console.log(err);
       } else {
           res.render("dbKeywords/index", {allKeywords:allKeywords});
       }
       
   }).sort({'keyword': 1}); // This gives back the results (all keywords in the db) ordered alphabetically
});

// SHOW - get info about specific keyword
router.get("/:id", function(req,res){
    // use the id to find the specific keyword in the database
    Keyword.findById(req.params.id, function(err,keyword){
        if(err){
            console.log(err);
        } else { //render the show page along with the required params
            res.render("dbKeywords/show",{historyData:keyword.updates, keyword:keyword.keyword})
        }
    });
});


router.delete("/:id",function(req,res){
    Keyword.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("Delete Keyword Route err: ");
            console.log(err);
            res.redirect("/dbKeywords");
        } else {
            res.redirect("/dbKeywords");
        }
    })
});






// get an object returned from an API and set it to be aligned with our DB
function setKeyFromAPI(object){
    var keyword = object.keyword;
    var traffic = Math.round(object.searchVolume);
    var difficulty = Math.round(object.ownIphoneChance);
    var competition = object.numberOfIphoneApps;
    createKeyFromAPI(keyword,traffic,difficulty,competition);
    return true;
}

function createKeyFromAPI(keyword){
    // get the API URL for a specific term and add this keywords to the DB
    var URL = "https://api.mobileaction.co/appstore-keyword-ranking/US/keyword-metadata?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28&keyword="+keyword;
    request(URL,function(err,res,body){
        if(!err && res.statusCode == 200){
            // Doing the adjustments from the API to be inserted to the DB
            setKeyFromAPI(JSON.parse(body));
        } else {
            console.log("createKeyFromAPI err: ");
            console.log(err);
        }
    });
}


// updateKeyword("hello",5.2,4.0,220);
// createKey("hello",4.6,8.4,256);

module.exports = router;