"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express"),
    Bottleneck = require("bottleneck"),
    regeneratorRuntime = require("regenerator-runtime"),
    app = express();

var limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 333
});

var makeRequests = {};

require("isomorphic-fetch");

makeRequests.sendData = function (urls) {
    urls.forEach(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
            var response, jsonResponse, counts;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return limiter.schedule(function () {
                                return fetch(url, {
                                    'method': 'POST',
                                    'headers': {
                                        'content-type': 'application/x-www-form-urlencoded',
                                        'charset': 'utf-8'
                                    }
                                });
                            });

                        case 3:
                            response = _context.sent;

                            if (!response.ok) {
                                _context.next = 9;
                                break;
                            }

                            _context.next = 7;
                            return response.json();

                        case 7:
                            jsonResponse = _context.sent;

                            if (!jsonResponse.success) {
                                console.log(jsonResponse.message);
                            }

                        case 9:
                            counts = limiter.counts();

                            console.log(counts);
                            _context.next = 16;
                            break;

                        case 13:
                            _context.prev = 13;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);

                        case 16:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 13]]);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());
};

module.exports = makeRequests;