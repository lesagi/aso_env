'use strict';

var express = require("express");
var rp = require('request-promise');
var $ = require('cheerio');
var router = express.Router();

router.get('/', function (req, res) {
  res.render(getMessages());
});

var getMessages = function getMessages() {
  return rp("https://www.cs.bgu.ac.il/~algo201/Main").then(function (html) {
    var dateMsgToDate = function dateMsgToDate(msg) {
      var dateStr = msg.match(new RegExp(/\d.*\d/gim))[0];
      var dayDateStr = dateStr.split(new RegExp(/\s/gim));
      var dayDateBits = dayDateStr[0].split("/");
      var newDayDateFormat = [dayDateBits[1], dayDateBits[0], dayDateBits[2]].join("/");
      return new Date(Date.parse(newDayDateFormat + ' ' + dayDateStr[1]));
    };

    var currTime = new Date(Date.now() - 60000 * 15); // fifteen minutes ago
    var newMessages = [];
    var dateElems = $('.messageboard .date', html);

    for (var i = 0; i < dateElems.length; i++) {
      var dateStr = dateElems[i]['children'][0]['data'];
      var msgDate = dateMsgToDate(dateStr);

      if (currTime.getTime() <= msgDate.getTime() || true) {
        var title = dateElems[i]['parent']['children'][1]['children'][0]['data'];
        var msgBody = dateElems[0]['parent']['children'][3]['children'][0]['data'];
        newMessages.push({ 'title': title, 'body': msgBody });
      }
    }
    return newMessages.map(function (currMsg, ind) {
      return '\n#(' + ind + ') - ' + currMsg.title + '\n      ' + currMsg.msgBody + '\n';
    }).join("\n");
  }).catch(function (err) {
    return console.log(err);
  });
};

module.exports = router;