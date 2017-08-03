

// var functions = require(".././functions");




function replaceChar(text, fChar, dChar){
    return text.split(fChar).join(dChar);
}

var toCommaBtn = document.getElementById("toCommaBtn");
var toLineBtn = document.getElementById("toLineBtn");
var commaField = document.getElementById("commaDelList");
var lineField = document.getElementById("lineDelList");

toLineBtn.addEventListener("click", function(){
	var text = commaField.value;
	lineField.value = replaceChar(text,",","\n");
});

toCommaBtn.addEventListener("click", function(){
	var text = lineField.value;
	commaField.value = replaceChar(text,"\n",",");
});


