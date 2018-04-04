var express = require("express"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
functions           = require("./functions"),
sortKeys           = require("./functions/sortingKeywords.js"),
request             = require("request"),
iosApp              = require("./models/iosApp.js"),
mongoose            = require("mongoose"),
Keyword             = require("./models/keyword.js"),
blackKeyword        = require("./models/blackKey.js"),
paginateArray       = require("paginate-array"),
Regex = require("regex"),
app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var option = {
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 300000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 300000
        }
    }
};

mongoose.connect(process.env.DATABASEURL, option);

// MONGOLAB mongodb://Admin:azsxdcfv@ds133004.mlab.com:33004/aso_env
//LOCAL mongodb://localhost/aso_env
//mongoose.connect("mongodb://localhost/aso_env")
    
//=================
// ROUTES IMPORTING
//=================

var phrasesCounterRoutes        = require("./routes/phrasesCounter.js"),
phraseBuilderRoutes             = require("./routes/phraseBuilder.js"),
apiCreatorRoutes                = require("./routes/apiCreator.js"),
dbKeywordsRoutes                = require("./routes/dbKeywords.js"),
wordExecRoutes                  = require("./routes/wordExec.js"),
dataInsertRoutes             = require("./routes/dataInsert.js"),
appsRoutes                       = require("./routes/apps.js");

app.use("/phrasesCounter", phrasesCounterRoutes);
app.use("/wordExec", wordExecRoutes);
app.use("/phraseBuilder", phraseBuilderRoutes);
app.use("/apiCreator", apiCreatorRoutes);
app.use("/dbKeywords", dbKeywordsRoutes);
app.use("/apps", appsRoutes);
app.use("/dataInsert", dataInsertRoutes)

// =====================
// Setting the routes
// =====================

//Home Route
app.get("/", function(req,res){
    res.render("index");    
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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});


