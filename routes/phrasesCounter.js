var express = require("express"),
app = express(),
functions = require("../functions"),
router = express.Router();



//phrasesCounter INDEX page
router.get("/", function(req,res){
    res.render("phrasesCounter/index");    
})


//SHOW Keywords list counter
router.post("/", function(req,res){
    
    var undelimitedList = req.body.keywordsList;
    var desc = req.body.fullDescription;
    var allDescWords = functions.cleanArray(functions.textToArr(desc));
    var descWords = functions.removeArrayDuplicates(functions.cleanArray(functions.textToArr(desc)));
    var keyList = functions.countKeywords(undelimitedList, desc);
    
   res.render("phrasesCounter/show", {keyList:keyList, undelimitedList:undelimitedList, desc:desc, descLen:allDescWords.length}); 
});

module.exports = router;