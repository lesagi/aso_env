var express = require("express"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
functions           = require("./functions"),
Regex = require("regex"),
app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


    
//=================
// ROUTES IMPORTING
//=================

var phrasesCounterRoutes         = require("./routes/phrasesCounter.js");
app.use("/phrasesCounter", phrasesCounterRoutes);


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
// WORD EXTRACTOR
// =====================

app.get("/wordExec", function(req, res){
   res.render("wordExec/index"); 
});

app.post("/wordExec",function(req, res){
   var arr = functions.textToArr(req.body.text);
   res.render("wordExec/show", {arr:arr});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});

