var express = require("express"),
request = require("request"),
iosApp = require("../models/iosApp.js"),
arrangeData = require("../functions/arrangeDataTypes.js"),
app = express();

var router = express.Router();

var fs = require("fs");
var paginate = require('express-paginate');
// keep this before all routes that will use pagination 
router.use(paginate.middleware(10, 200));

function createIosAppWithApi(storeId, callback){
    var URL = "https://api.mobileaction.co/appstore-appinfo/"+storeId+"?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28"
    request(URL,function(err,res,body){
        if(!err){
            var retrievedApp = JSON.parse(body);
            
            var appDetails = retrievedApp.app
            
            var appVersionsLen = (retrievedApp.appVersionList).length;
            var latestVersion = retrievedApp.appVersionList[appVersionsLen-1];
            
            var newApp = {};
            newApp.countries = retrievedApp.countryList;
            newApp = copyDataFromAPPI(appDetails, latestVersion, newApp);
            iosApp.create(newApp,function(err,newApp){
                if(!err){
                    setMMPID(storeId, callback);
                }
            });
        } else {
            console.log("createIosAppWithApi ERROR!:");
            console.log(err);
        }
  });
}

function copyDataFromAPPI(appDetails,latestVersion,newApp){
    newApp.title = appDetails.name;
    newApp.normalized = appDetails.name;
    newApp.storeId = appDetails.trackId;
    newApp.versionString = latestVersion.versionString;
    newApp.categoryId = appDetails.categoryId;
    newApp.iconUrl = appDetails.iconUrl;
    newApp.price = appDetails.price;
    newApp.releaseDate = appDetails.releaseDate;
    newApp.lastModified = appDetails.lastModified;
    
    return newApp;
}

//function to add to a certain app it's mmpId. the app gets only the id of an App
function setMMPID(storeId, callback){
    var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
    request(URL,function(err,res,body){
        var allApps = JSON.parse(body);
        iosApp.findOne({storeId:storeId},function(err,foundApp){
            if(!err && typeof(allApps.data[storeId]) !== 'undefined'){
               foundApp.mmpId = allApps.data[storeId].appId
               foundApp.save();
            } else {
                console.log("apps.js routes - setMMPID err: The application doesn't exist in MobileAction");
                console.log(err);
            }
           
        })
        .then(function(){
            if(callback){
                callback();
            }
        });
    });
    
}

// *** need to also add the option that an app was removed from MobileAction and therefore
// it's mmpId need to be set to null again ***
function validateMmpIds(callback){
    iosApp.find({mmpId:null},function(err,apps){
        if(!err){
            apps.forEach(function(app){
                setMMPID(app.storeId);
            }).then(callback());
        }
    });
};

router.get("/",function(req,res,next){
    
    var searchTerm = req.query.title;

    if(!req.query.title){
        var searchTerm = "";
    }
    
    var defineQuery = {
        'title' : { $regex: new RegExp(searchTerm, 'gi') }
    }

    var atoz = req.query.sort;
    if(!req.query.sort){
        var atoz = 1;
    }
    
    
    iosApp.paginate(defineQuery,{ sort: { 'title': atoz}, page: req.query.page, limit: req.query.limit }, function(err, apps) {

        if (err) return next(err);
            res.format({
                html: function() {
                    res.render('apps/index', {
                        lastPage: apps.pages,
                        searchTerm: searchTerm,
                        atoz: atoz,
                        apps: apps.docs,
                        pageCount: apps.pages,
                        itemCount: apps.limit,
                        pages: paginate.getArrayPages(req)(3, apps.pages, req.query.page)
                    });
                },
            json: function() {
                // inspired by Stripe's API response for list objects 
                res.json({
                    object: 'list',
                    has_more: paginate.hasNextPages(req)(apps.pages),
                    data: apps.docs
                });
            }
        });
    });

});


// SHOW PAGE
router.get("/:id", function(req,res){
    iosApp.findById({_id:req.params.id}).populate("keywords").exec(function(err,app){
        if(!err){
            res.render("apps/show",{app:app});
        }
        
    });
});



// CREATE PAGE
router.post("/",function(req,res){
    // Extracting app ID from the whole URL
    var regex = new RegExp("\\d{5,}", "gi");
    var storeId = ((req.body.storeId).match(regex))[0];
  
    
    // Add app to DB only if it doesn't exist yet
    iosApp.findOne({storeId:storeId},function(err,foundApp){
       if(!foundApp){
           // The second arg in the function below is responsible for making the redirection on the right time
           // meaning, only after the app was added to the DB.
           // This is a callback function, trigerred only after the procedure has been completed.
            createIosAppWithApi(storeId,function(){res.redirect("back")});
    
       } else {
           res.redirect("/apps");
       }
    });

});



router.delete("/:id", function(req, res){
    iosApp.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("apps.js routes - deleting app error: ");
            console.log(err);
        }
    })    ;
    res.redirect("back");
});

function appsToCSV(apps,headers){
    var allApps = [];
    allApps.push(headers);
    apps.forEach(function(app){
        var arr = [];
        arr.push(app.title);
        arr.push(app.storeId);
        arr.push(app.mmpId);
        arr.push(app.versionString);
        // Last Version Date is not yet configured
        // arr.push(app.lastVersionDate.toLocaleDateString());
        arr.push(app.releaseDate.toLocaleDateString());
        

        allApps.push(arr)
    });
    // var csvContent = "data:text/csv;charset=utf-8,";
    var csvContent = "";
    allApps.forEach(function(infoArray, index){
    
      var dataString = infoArray.join(",");
      csvContent += index < allApps.length ? dataString+ "\n" : dataString;
    }); 
    // csvContent = "\"" + csvContent + "\"";
    
    return csvContent;
}

// Download Apps List to CSV
router.get("/exportData/appsList", function(req,res){
     iosApp.find().lean().exec(function (err, apps) {
        if(!err && apps.length!==0){
             res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=Apps List.csv'
            });
            
            res.end(appsToCSV(apps,["Title","Store ID","MobileAction ID","Version","Release Date"]),"binary");
        } else {
            res.redirect("/apps");
        }
       
    });
});


// Delete only KEYWORD from the keywords array for a specific app
router.delete("/:appId/:i", function(req,res){
   iosApp.findById(req.params.appId, function(err,foundApp){
      if(!err){
          foundApp.keywords.splice(req.params.i,1);
          foundApp.save();
      } 
   });
   res.redirect("/apps/" + req.params.appId);
});

// UPDATE MMPSIDS only
router.put("/",function(req,res){
    // In case that a specific app didn't have mmpId, and it's status has changed due to that
    // It was added, we need to verify it periodically
    validateMmpIds(function(){res.redirect("back")});

});

module.exports = router;