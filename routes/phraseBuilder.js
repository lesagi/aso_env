var express = require("express"),
functions = require("../functions"),
arrangeData = require("../functions/arrangeDataTypes.js"),
Keyword = require("../models/keyword.js"),
iosApp = require("../models/iosApp.js"),
blackKeyword = require("../models/blackKey.js"),
dbKeywordsAccess = require("../functions/sortingKeywords.js"),
app = express();

var router = express.Router();

// =====================
// phraseBuilder
// =====================

router.get("/", function(req, res){
   // the following query retrieved only apps that have mmpId, meaning existed in MA
   //({mmpId:{$ne: null}},null,{sort:'normalized'},function(err,iosApps)
   iosApp.find({},null,{sort:'normalized'},function(err,iosApps){
       res.render("phraseBuilder/index", {iosApps:iosApps}); 
   });
  
});

router.post("/",function(req, res){
   var level = Number(req.body.level)
   
   var titleArr = functions.textToArr(req.body.title);
   titleArr = functions.cleanArray(titleArr);
   titleArr = functions.removeArrayDuplicates(functions.buildPhrases(titleArr,level));
   
   var subTitleArr = functions.textToArr(req.body.subtitle);
   //level var determines how long the phrase will be in terms of number of keywords
   subTitleArr = functions.cleanArray(subTitleArr);
   subTitleArr = functions.removeArrayDuplicates(functions.buildPhrases(subTitleArr,level));
   
   var csvList = arrangeData.arrayToCsv(subTitleArr,"Keyword");
   
   dbKeywordsAccess.sortNewPhrases(titleArr, req.body.storeId);
   // GET all keywords from the DB so the tables in the show page will have the traffic score alongside the keywords permutation
   Keyword.find({},function(err,keywords){
      if(!err){
         blackKeyword.find({},function(err,blackKeywords){
            if(!err){
               try{
                  res.render("phraseBuilder/show", {titleArr:titleArr, subTitleArr:subTitleArr, csvList:csvList, keywords:keywords, blackKeywords:blackKeywords});
               } catch(err) {
                  console.log(err);
                  res.send("request timed out");
               }
            }
         });
         
      }
   });
});





module.exports = router;