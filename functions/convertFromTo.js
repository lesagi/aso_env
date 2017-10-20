var express = require("express"),
app = express();

var convertFromTo = {
    
arrayToCsv: function(arr,headers) {
   var csv = "data:text/csv;charset=utf-8,"
   csv += headers;
   arr.forEach(function(row) {
         csv += "\\n" + row;
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
    var bigArr = [];
    
    arr.forEach(function(el,i){
		if(i%limit === 0){
			bigArr.push([]);
		}
        var bigArrPosition = Math.floor(i/limit);
        bigArr[bigArrPosition].push(el);
    });
    return bigArr;
}

}
    
    
module.exports = convertFromTo;