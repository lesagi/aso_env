var express = require("express"),
mongoose    = require("mongoose"),
app = express();

var blackKeywordSchema = new mongoose.Schema({
   keyword: String,
   added: {type:Date, default: new Date()}
});

module.exports = mongoose.model("blackKeyword", blackKeywordSchema);