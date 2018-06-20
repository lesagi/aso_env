var functions = require(".././functions");

//textToArray - the function get bunch of text and compile an array with each word as an object in the array
function getFirstWord(text) {
	var fChar = 0;
	var lChar = 0;

	//Create regex with a pattern of any Word-Character or geresh(')
  var regex = new RegExp();
  regex = /(?:(\w|'))/i;
  text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

 		//Going over the text until matches a char that doesn't meet the requirements above
		while (!regex.test(text.charAt(fChar))){
			fChar++;
		}

		lChar = fChar;
		while (regex.test(text.charAt(lChar))){
			lChar++;
		}
		var word = text.substring(fChar,lChar);
		fChar = lChar;

  return  word
}


function textToArr(text){
	var regex = new RegExp();
	regex = /(?:(\w|'))/i;
	var arr=[];
	while(regex.test(text)){
		var word = getFirstWord(text);
		
		arr.push(word);
		text = text.slice(text.search(regex)+word.length);
	}
	return arr;
}

var toCommaBtn = document.getElementById("toCommaBtn");
var toLineBtn = document.getElementById("toLineBtn");
var commaField = document.getElementById("commaDelList");
var lineField = document.getElementById("lineDelList");

toLineBtn.addEventListener("click", function(){
	var text = commaField.value;
	lineField.value = functions.replaceChar(text,",","\n");
});

toCommaBtn.addEventListener("click", function(){
	var text = lineField.value;
	commaField.value = functions.replaceChar(text,"\n",",");
});
