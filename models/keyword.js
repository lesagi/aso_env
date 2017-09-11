var express = require("express"),
mongoose    = require("mongoose"),
app = express();

var keywordSchema = new mongoose.Schema({
   keyword: { type: String, lowercase: true },
   addedToDB: {type: Date, default: Date.now},
   updates: [{ 
      date: {type: Date, default: new Date},
      traffic: Number,
      difficulty: Number,
      competition: Number,
      updated: {type: Date, default: Date.now}
   }]
});

module.exports = mongoose.model("Keyword", keywordSchema);