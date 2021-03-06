var express = require("express"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
app                 = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

    
//=================
// ROUTES IMPORTING
//=================

var phrasesCounterRoutes            = require("./ES5/routes/phrasesCounter.js"),
phraseBuilderRoutes                 = require("./ES5/routes/phraseBuilder.js"),
apiCreatorRoutes                    = require("./ES5/routes/apiCreator.js"),
wordExecRoutes                      = require("./ES5/routes/wordExec.js"),
apiRequests                         = require("./ES5/routes/api/apiRequests/getStatus.js"),
algoScraping                         = require("./ES5/routes/api/algoScraping.js"),
wordsInjectionRoutes                = require("./ES5/routes/wordsInjection.js");

app.use("/phrasesCounter", phrasesCounterRoutes);
app.use("/wordExec", wordExecRoutes);
app.use("/phraseBuilder", phraseBuilderRoutes);
app.use("/apiCreator", apiCreatorRoutes);
app.use("/wordsInjection", wordsInjectionRoutes);
app.use("/apiStatus", apiRequests);
app.use("/algoScraping", algoScraping);

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

app.get("/names-generator", function(req,res){
    res.render("names-generator/index"); 
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


