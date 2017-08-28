var mongoose = require("mongoose");

var iosAppSchema = new mongoose.Schema({
    storeID: String,
    title: String,
    subtitle: String,
    description: String,
    iconURL: String, //URL
    allKeywords: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Keyword"
    }],
    countries: [String],
    lastModfidied: {type: Date, default: Date.now}
});

module.exports = mongoose.model("iosApp",iosAppSchema);