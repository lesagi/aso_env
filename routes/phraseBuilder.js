var express = require("express"),
functions = require("../functions"),
app = express();

var router = express.Router();

// =====================
// phraseBuilder
// =====================

router.get("/", function(req, res){
   res.render("phraseBuilder/index"); 
});

router.post("/",function(req, res){
   
   var titleArr = functions.textToArr(req.body.title);
   titleArr = functions.cleanArray(titleArr);
   titleArr = functions.removeArrayDuplicates(functions.buildPhrases(titleArr));
   
   var subTitleArr = functions.textToArr(req.body.subtitle);
   subTitleArr = functions.cleanArray(subTitleArr);
   subTitleArr = functions.removeArrayDuplicates(functions.buildPhrases(subTitleArr));
   
   res.render("phraseBuilder/show", {titleArr:titleArr, subTitleArr:subTitleArr});
});



module.exports = router;