var express = require("express"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
functions           = require("./functions"),
request             = require("request"),
iosApp              = require("./models/iosApp.js"),
mongoose            = require("mongoose"),
Keyword             = require("./models/keyword.js"),
blackKeyword        = require("./models/blackKey.js"),
Regex = require("regex"),
app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect(process.env.DATABASEURL);

// MONGOLAB mongodb://Admin:azsxdcfv@ds133004.mlab.com:33004/aso_env
//LOCAL mongodb://localhost/aso_env
// mongoose.connect("mongodb://localhost/aso_env")
    
//=================
// ROUTES IMPORTING
//=================

var phrasesCounterRoutes        = require("./routes/phrasesCounter.js"),
phraseBuilderRoutes             = require("./routes/phraseBuilder.js"),
apiCreatorRoutes                = require("./routes/apiCreator.js"),
dbKeywordsRoutes                = require("./routes/dbKeywords.js"),
wordExecRoutes                  = require("./routes/wordExec.js");

app.use("/phrasesCounter", phrasesCounterRoutes);
app.use("/wordExec", wordExecRoutes);
app.use("/phraseBuilder", phraseBuilderRoutes);
app.use("/apiCreator", apiCreatorRoutes);
app.use("/dbKeywords", dbKeywordsRoutes);

// =====================
// Setting the routes
// =====================

//Home Route
app.get("/", function(req,res){
    res.redirect("/phrasesCounter");    
});

// =====================
// COMMA SEPERATOR
// =====================

// SHOW COMMA SEPERATOR
app.get("/commaSeperator", function(req,res){
    res.render("commaSeperator/index");    
});

// =====================
// keywords highlighter
// =====================

app.get("/highlighter", function(req,res){
   res.render("highlightKeys/index"); 
});

// request("https://market.android.com/suggest/SuggRequest?json=1&c=3&query=forex B&hl=US&gl=en-US", function(err,res,body){
//   var parsedData = JSON.parse(body);
//   parsedData.forEach(function(){
//     //  console.log(this) 
//   });
// });


// var retrievedApp = {
//   "trackId": 284882215,
//   "countries": [ "US","JP","CN","GB","AU","TR","CA","FR","VN"],
//   "appVersionHistory": 
//     [
//       {
//         "versionString": "16.0",
//         "versionDate": 1413395054000,
//         "releaseNotes": "Thanks for using Facebook! To make our app better ..."
//       },
//       {
//         "versionString": "46.0",
//         "versionDate": 1450380626000,
//         "releaseNotes": "Thanks for using Facebook! To make our app better ..."
//       }
//     ],
//   "appVersionDetailedHistory": 
//     [
//       {
//         "versionString": "37.0",
//         "name": "Facebook",
//         "categoryId": 6005,
//         "iconUrl": "http://is2.mzstatic.com/image/pf/us/r30/Purple69/v4/39/4d/f2/394df214-8b57-29e3-3eec-74cf91d303c8/Icon-Production.png",
//         "price": "Free"
//       },
//       {
//         "versionString": "46.0",
//         "name": "Facebook",
//         "categoryId": 6005,
//         "iconUrl": "http://is3.mzstatic.com/image/thumb/Purple7/v4/ff/61/5d/ff615df3-7a64-fce1-1136-6443a07f2655/source/60x60bb.jpg",
//         "price": "Free"
//       }
//     ],
//   "latestVersion": 
//     {
//       "versionString": "46.0",
//       "name": "Facebook",
//       "categoryId": 6005,
//       "iconUrl": "http://is3.mzstatic.com/image/thumb/Purple7/v4/ff/61/5d/ff615df3-7a64-fce1-1136-6443a07f2655/source/60x60bb.jpg",
//       "price": "Free"
//     },
//   "releaseDate": 1215759600000,
//   "lastVersionDate": 1450380626000,
//   "url": "https://itunes.apple.com/us/app/facebook/id284882215?mt=8&uo=4",
//   "removed": false,
//   "lastModified": 1450717805283
// }

app.get("/apps", function(req,res){
    //this route will get storeId, mmpId, and app title from the body of the previous call.
    
   res.send("created");
});

function createIosAppWithApi(storeId){
    request("https://api.mobileaction.co/appstore-appinfo/"+storeId+"?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28",function(err,res,body){
        var retrievedApp = JSON.parse(body);
        var newApp = retrievedApp;
        newApp = arrangeDataModel(retrievedApp, newApp);
        // console.log(newApp);
        iosApp.create(newApp,function(err,newApp){
          console.log(newApp);
        });
   });
}

function arrangeDataModel(retrievedApp,newApp){
    newApp.storeId = retrievedApp.trackId;
    newApp.versionString = retrievedApp.latestVersion.versionString;
    newApp.title = retrievedApp.latestVersion.name;
    newApp.categoryId = retrievedApp.latestVersion.categoryId;
    newApp.iconUrl = retrievedApp.latestVersion.iconUrl;
    newApp.price = retrievedApp.latestVersion.price;
    
    return newApp;
}

//function to add to a certain app it's mmpId. the app gets only the id of an App

     
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});


