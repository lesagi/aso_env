var express = require("express"),
Keyword = require("../models/keyword.js"),
functions = require("../functions"),
request = require("request"),
blackKeyword = require("../models/blackKey.js"),
sortPhrasesFunctions = require("../functions/sortingKeywords.js"),
app = express();

var router = express.Router();

var mongoose_csv = require('mongoose-csv');
var fs = require("fs");

var json2csv = require('json2csv');

var paginate = require('express-paginate');
// keep this before all routes that will use pagination 
router.use(paginate.middleware(10, 200));


// =====================
// Keyword Presentation
// =====================


// INDEX page
router.get("/", function(req,res,next){

    var searchTerm = req.query.keyword;
    if(!req.query.keyword){
        var searchTerm = "";
    }
    var defineQuery = {
        'keyword' : { $regex: new RegExp('\\b' + searchTerm, 'gi') }
    }
    
    var atoz = req.query.sort;
    if(!req.query.sort){
        var atoz = 1;
    }

    Keyword.paginate(defineQuery,{ sort: { 'keyword': atoz}, page: req.query.page, limit: req.query.limit }, function(err, keywords) {
        if (err) return next(err);
            res.format({
                html: function() {
                    res.render('dbKeywords/index', {
                        lastPage: keywords.pages,
                        searchTerm: searchTerm,
                        atoz: atoz,
                        keywords: keywords.docs,
                        pageCount: keywords.pages,
                        itemCount: keywords.limit,
                        pages: paginate.getArrayPages(req)(3, keywords.pages, req.query.page)
                    });
                },
            json: function() {
                // inspired by Stripe's API response for list objects 
                res.json({
                    object: 'list',
                    has_more: paginate.hasNextPages(req)(keywords.pages),
                    data: keywords.docs
                });
            }
        });
    });
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


function getTodayDate(){
    var today = new Date();
    return today.toDateString();
}

router.get("/verified/csv",function(req,res){
    Keyword.find().lean().exec(function (err, keywords) {
        
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=Verified Keywords_' + getTodayDate() + '.csv'
        });
        res.end(keywordsToCSV(keywords,["Keywords","Traffic","Difficulty","Competition","Date"]),"binary");
    })

});

        
// Keyword.find({},function(err,keywords){
//     console.log(keywordsToCSV(keywords));
// })


// GET ALL KEYWORDS from Database Exported to CSV
// This function only works with res.header
// It works in a way where it first sets the format to be as CSV and then it send this organized CSV string to the header and force download in CSV format
function keywordsToCSV(keywords,headers){
    var allKeys = [];
    allKeys.push(headers);
    keywords.forEach(function(foundKeyword){
        var arr = [];
        arr.push(foundKeyword.keyword)
        var lastUpdate = (foundKeyword.updates)[(foundKeyword.updates).length-1];
    
        arr.push(lastUpdate.traffic)
        arr.push(lastUpdate.difficulty)
        arr.push(lastUpdate.competition)
        arr.push(lastUpdate.date.toLocaleDateString())
        allKeys.push(arr)
    });
    // var csvContent = "data:text/csv;charset=utf-8,";
    var csvContent = "";
    allKeys.forEach(function(infoArray, index){
    
      var dataString = infoArray.join(",");
      csvContent += index < allKeys.length ? dataString+ "\n" : dataString;
    }); 
    // csvContent = "\"" + csvContent + "\"";
    
    return csvContent;
}




// ----------- ALTERNATIVE EXPORTATION TO CSV
// router.get("/verified/csv",function(req,res){
//     Keyword.find().lean().exec(function (err, keywords) {
        
//         // Convert the DB structure to a new tide structure
//         var newStruct = customizeJsonResult(keywords);
        
//         // write the temp file to the folder
//         writeKeywordsCSV(newStruct);
        
//         // Makes sure that the download will start only after the was created and is full with data
//         // without setTimeout() we get an empty file
//         setTimeout(function(){
//             return res.download('tempFiles/verifiedKeywords.csv', 'Verified Keywords_' + getTodayDate() + '.csv')
//         },0);
//         return newStruct;
//     })

// });


function writeKeywordsCSV(keywords){
    var fields = ['Keyword', 'Traffic', 'Difficulty', 'Competition', 'Date'];
    var fieldNames = ['Keyword', 'Traffic', 'Difficulty', 'Competition', 'Date'];
    
    var myData = keywords;
    try {
      var result = json2csv({ data: myData, fields: fields,fieldNames:fieldNames, quotes: '' });
      fs.writeFile(('tempFiles/verifiedKeywords.csv'), result, function(err) {
        if (err) throw err;
            console.log('file saved');
        });
    } catch (err) {
      console.error(err);
    }
};



function customizeJsonResult(keywords, res){
    var allKeywordsArr = [];
    keywords.forEach(function(keyword){
        //Pointer to the last element in the updates list
        var lastUpdatesIndex = keyword.updates.length-1;
        
        //last element
        var el = keyword.updates[lastUpdatesIndex];
        
        var newForm = {
            Keyword     : keyword.keyword,
            Traffic     : el.traffic,
            Difficulty  : el.difficulty,
            Competition : el.competition,
            Date        : el.date.toLocaleDateString()
        }
        allKeywordsArr.push(newForm);
    });
    // console.log(JSON.stringify(allKeywordsArr));
    return (allKeywordsArr);
}





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