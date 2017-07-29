var express = require("express"),
Regex = require("regex"),
app = express();

var regex = new RegExp();


var functions = {};

functions.listToArray = function(text) {
	// get line-by-line list and break into an array
	var array =[];
	if(text.search(',') !== -1){
	    array = text.split(',');
	} else {
	    array = text.split('\n');
	}
	

	// itterate throught the array to remove spaces with jQuery trim function --> $.trim(singleWord)
	// change all list to lowercase
	for(var i=0; i<array.length; i++){
		array[i] = array[i].trim();
		array[i] = array[i].toLowerCase();
	}

	return array
}

// Remove duplicates in arrray
functions.removeArrayDuplicates = function(array){
	var cleanedArray = [];
    Array.prototype.forEach.call(array, function(el, i){
        if(cleanedArray.indexOf(el) === -1) {
	    	cleanedArray.push(el);
	    } 
    });

	return cleanedArray;
}

functions.countWordInPhrase = function(word, phrase) {
  // Escape any characters in `word` that may have a special meaning
  // in regular expressions.
  // Taken from https://stackoverflow.com/a/6969486/4220785
  word = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

  // Replace any whitespace in `word` with `\s`, which matches any
  // whitespace character, including line breaks.
  word = word.replace(/\s+/g, '\\s')

  // Create a regex with our `word` that will match it as long as it
  // is surrounded by a word boundary (`\b`). A word boundary is any
  // character that isn't part of a word, like whitespace or
  // punctuation.
  var regex = new RegExp('\\b' + word + '\\b', 'g')

  // Get all of the matches for `phrase` using our new regex.
  var matches = phrase.match(regex)

  // If some matches were found, return how many. Otherwise, return 0.
  return matches ? matches.length : 0
}

// count the times a word appears in a string and return a dictionary with the words as values and the number of appearence as their values
functions.countedKeywordsDic = function(wordsList,doc){
	
    var wordsDic = {};
    var c = 0;
    wordsList.forEach(function(word){
    	c = functions.countWordInPhrase(word, doc);
    	if(c !== 0){
    	    wordsDic[word] = c;
    	}
            
    });
    return wordsDic;
}

functions.countKeywords = function(list, text){
	var dic = {};
	var array = functions.listToArray(list);
	array = functions.removeArrayDuplicates(array);
	dic = functions.countedKeywordsDic(array, text);
	return dic;
}

functions.replaceChar = function(text, fChar, dChar){
    return text.split(fChar).join(dChar);
}

module.exports = functions;