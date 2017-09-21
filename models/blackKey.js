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

// ------------mongoose_csv----------------------
var mongoose_csv = require('mongoose-csv');
blackKeywordSchema.plugin(mongoose_csv,{
   headers: 'Traffic',
   constraints: {
      'Keyword': 'keyword'/2
   }
});

module.exports = mongoose.model("blackKeyword", blackKeywordSchema);