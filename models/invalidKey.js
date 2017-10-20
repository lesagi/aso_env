var express = require("express"),
mongoose    = require("mongoose"),
app = express();

var invalidKeywordSchema = new mongoose.Schema({
   keyword: String,
   traffic: Number,
   difficulty: Number,
   competition: Number,
   added: {type:Date, default: new Date()}
});

// ------------mongoose_csv----------------------
var mongoose_csv = require('mongoose-csv');
invalidKeywordSchema.plugin(mongoose_csv)

module.exports = mongoose.model("invalidKeyword", invalidKeywordSchema);