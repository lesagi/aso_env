var express = require("express"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
functions           = require("./functions"),
app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/css"));


app.use(methodOverride("_method"));

// =====================
// Setting the routes
// =====================

//Home Route
app.get("/", function(req,res){
    res.render("phrasesCounter/index");    
});

//phrasesCounter INDEX page
app.get("/", function(req,res){
    res.render("phrasesCounter/index");    
})


//SHOW Keywords list counter
app.post("/phrasesCounter", function(req,res){
    
    var undelimitedList = req.body.keywordsList;
    var desc = req.body.fullDescription;
    
    var keyList = functions.countKeywords(undelimitedList, desc);
    
   res.render("phrases/Countershow", {keyList:keyList}); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});

