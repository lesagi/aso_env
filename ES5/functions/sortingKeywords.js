"use strict";

var express = require("express"),
    app = express();

var sortKeys = {}; // The main variable that is exported from this file. Contains all the functions.

sortKeys.keyFinderCtor = function (currentKeywords) {
    var sortedArray = currentKeywords.sort();
    return function (key) {
        return binaryFound(key, sortedArray);
    };
};

function alphabetDesc(a, b) {
    return b.localeCompare(a);
};

function binaryFound(key, arr) {
    return binarySearch(key, arr) != -1;
}

function binarySearch(key, arr) {
    var output = -1; // default (not found) value
    var found = false;
    var low = 0,
        high = arr.length - 1;
    while (low <= high & !found) {
        var middle = Math.floor((low + high) / 2);
        var val = String(arr[middle]);
        if (val == key) {
            output = middle;
            found = true;
        } else if (key < val) high = middle - 1;else low = middle + 1;
    }
    return output;
};

sortKeys.duplicatesRemoved = function (arr, currentKeywords) {
    var finder = sortKeys.keyFinderCtor(currentKeywords);
    return arr.filter(function (curr) {
        return !finder(curr);
    });;
};

module.exports = sortKeys;