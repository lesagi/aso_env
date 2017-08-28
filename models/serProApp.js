var mongoose = require("mongoose");

var serProAppSchema = new mongoose.Schema({
    storeID: String,
    MAID: String,
    title: String
});

module.exports = mongoose.model("serProApp", serProAppSchema);