"use strict";

var express = require("express"),
    app = express();

var convertFromTo = {

    arrayToCsv: function arrayToCsv(arr, headers) {
        var csv = "data:text/csv;charset=utf-8,";
        csv += headers;
        arr.forEach(function (row) {
            csv += "\\n" + decodeURI(row);
        });
        // console.log(csv);
        // console.log("\"" + csv + "\"");
        csv = "\"" + csv + "\"";
        return csv;
    },

    objectArrayToCSV: function objectArrayToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = "data:text/csv;charset=utf-8,";
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    },

    arrToSubArrays: function arrToSubArrays(arr, limit) {
        //in this bigArr each element is an array with up to 'limit' number of keywords
        var bigArr = [];

        while (arr.length != 0) {
            bigArr.push(arr.splice(0, limit));
        }
        return bigArr;
    }

};

module.exports = convertFromTo;