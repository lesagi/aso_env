"use strict";

var express = require("express"),
    functions = require("../functions"),
    app = express();

var router = express.Router();

// =====================
// WORD EXTRACTOR
// =====================

router.get("/", function (req, res) {
   res.render("wordExec/index");
});

router.post("/", function (req, res) {
   var arr = functions.textToArr(req.body.text);
   arr = functions.cleanArray(arr);
   arr = functions.removeArrayDuplicates(arr);
   res.render("wordExec/show", { arr: arr });
});

module.exports = router;