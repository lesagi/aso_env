var express = require("express"),
mongoose    = require("mongoose"),
app = express();

var blackKeywordSchema = new mongoose.Schema({
   keyword: String,
   traffic: Number,
   difficulty: Number,
   competition: Number,
   added: {type:Date, default: new Date()}
});

module.exports = mongoose.model("blackKeyword", blackKeywordSchema);