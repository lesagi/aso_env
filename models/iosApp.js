var mongoose = require("mongoose");

var iosAppSchema = new mongoose.Schema({
    "title": String,
    "storeId": Number,
    "mmpId": Number,
    "countries": [String],
    "versionString": String,
    "categoryId": Number,
    "iconUrl": String,
    "price": String,
    "releaseDate": Date,
    "lastVersionDate": Date,
    "url": String,
    "lastModified": Date,
    "keywords": [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Keyword"
        }
    ]
});

module.exports = mongoose.model("iosApp",iosAppSchema);