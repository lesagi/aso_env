var express = require("express"),
mongoose    = require("mongoose"),
app = express();

var mongoosePaginate = require('mongoose-paginate');

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

// ------------mongoose_csv----------------------
var mongoose_csv = require('mongoose-csv');
keywordSchema.plugin(mongoose_csv);

// -------------mongoose-pagination ---------------
keywordSchema.plugin(mongoosePaginate);



module.exports = mongoose.model("Keyword", keywordSchema);