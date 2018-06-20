var express = require("express"),
app = express();

var convertFromTo = {
    
arrayToCsv: function(arr,headers) {
   var csv = "data:text/csv;charset=utf-8,"
   csv += headers;
   arr.forEach(function(row) {
         csv += "\\n" + decodeURI(row);
   });
   // console.log(csv);
   // console.log("\"" + csv + "\"");
   csv = "\"" + csv + "\"";
   return csv;
},

objectArrayToCSV: function(args) { 
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

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
},


arrToSubArrays: function(arr,limit){
    //in this bigArr each element is an array with up to 'limit' number of keywords
    var bigArr = [];
    
    //numOfChunks - equals the number of rows in the big two dimensional array
    var numOfChunks = Math.ceil(arr.length/limit);
    
    for(var i=0; i<numOfChunks; i++){
        var first = i*limit;
        var last = first + limit;
        bigArr.push(arr.slice(first, last));
    }
    return bigArr;
}

}
    
    
module.exports = convertFromTo;