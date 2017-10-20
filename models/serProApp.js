var mongoose = require("mongoose");

var tempVarsSchema = new mongoose.Schema({
    compiledPhrases: Array
});

module.exports = mongoose.model("tempVars", tempVarsSchema);