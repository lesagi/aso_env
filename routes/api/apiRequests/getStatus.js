const express = require("express"),
app = express();

const router = express.Router();
import apiRequests from "../../../functions/requestSender";

router.get('/', function (req, res) {
    res.json(apiRequests.getRequestsStatus());
});

module.exports = router;