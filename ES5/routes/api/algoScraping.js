'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express");
var rp = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();

router.get('/', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var messages;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getMessages();

          case 2:
            messages = _context.sent;

            res.json(messages);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var getMessages = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', rp("https://www.cs.bgu.ac.il/~algo201/Main").then(function (html) {
              var $ = cheerio.load(html);
              var dateMsgToDate = function dateMsgToDate(msg) {
                var dateStr = msg.match(new RegExp(/\d.*\d/gim))[0];
                var dayDateStr = dateStr.split(new RegExp(/\s/gim));
                var dayDateBits = dayDateStr[0].split("/");
                var newDayDateFormat = [dayDateBits[1], dayDateBits[0], dayDateBits[2]].join("/");
                return new Date(Date.parse(newDayDateFormat + ' ' + dayDateStr[1]));
              };

              var currTime = new Date(Date.now() - 60000 * 15); // fifteen minutes ago
              var ids = $('.messageboard', html).toArray().map(function (curr) {
                return curr['attribs']['id'];
              });
              var messages = ids.map(function (id, i) {
                var title = $('.subject', '#' + id).text();
                var body = $('.body', '#' + id).text();
                var date = dateMsgToDate($('.date', '#' + id).text());
                if (currTime.getTime() <= date.getTime() || true) {
                  return {
                    "index": i + 1,
                    "title": title.trim(),
                    "body": body.trim()
                  };
                } else return {};
              });
              return messages.filter(function (curr) {
                return curr !== {};
              });
            }).catch(function (err) {
              return console.log(err);
            }));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getMessages() {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = router;