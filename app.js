var express = require("express"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
functions           = require("./functions"),
request             = require("request"),
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


     
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});
