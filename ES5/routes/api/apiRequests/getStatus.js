"use strict";

var _requestSender = require("../../../functions/requestSender");

var _requestSender2 = _interopRequireDefault(_requestSender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express"),
    app = express();

var router = express.Router();


router.get('/', function (req, res) {
    res.json(_requestSender2.default.getRequestsStatus());
});

module.exports = router;