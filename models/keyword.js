var express = require("express"),
mongoose    = require("mongoose"),
app = express();

var keywordSchema = new mongoose.Schema({
   term: { type: String, lowercase: true },
   updates: [{ 
      date: {type: Date, default: Date.now},
      traffic: Number,
      difficulty: Number,
      competition: Number,
      updated: {type: Date, default: Date.now}
   }]
});

module.exports = mongoose.model("Keyword", keywordSchema);