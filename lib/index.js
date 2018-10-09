"use strict";

var _bottleneck = require("bottleneck");

var _bottleneck2 = _interopRequireDefault(_bottleneck);

var _regeneratorRuntime = require("regenerator-runtime");

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

require("isomorphic-fetch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express"),
    app = express();

// ECMAScript 2015


var limiter = new _bottleneck2.default({
    maxConcurrent: 1,
    minTime: 333
});

var makeRequests = {};

makeRequests.sendData = function (urls) {
    urls.forEach(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee(url) {
            var response, jsonResponse, counts;
            return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
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
                                _context.next = 11;
                                break;
                            }

                            _context.next = 7;
                            return response.json();

                        case 7:
                            jsonResponse = _context.sent;

                            if (!jsonResponse.success) {
                                console.log(url);
                            }

                            _context.next = 12;
                            break;

                        case 11:
                            throw new Error("Something went wrong");

                        case 12:
                            counts = limiter.counts();

                            console.log(counts);
                            _context.next = 19;
                            break;

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);

                        case 19:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 16]]);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());
};

module.exports = makeRequests;