var mongoose = require("mongoose"),
mongoosePaginate = require('mongoose-paginate');

var iosAppSchema = new mongoose.Schema({
    "title": String,
    "normalized": {type: String, lowercase: true, trim: true},
    "storeId": Number,
    "mmpId": {type: Number, default:null},
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

// -------------mongoose-pagination ---------------
iosAppSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("iosApp",iosAppSchema);