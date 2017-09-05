var express = require("express"),
Regex = require("regex"),
request = require("request"),
app = express();

var regex = new RegExp();


var functions = {};


functions.cleanArray = function(array){
    // itterate throught the array to remove spaces with jQuery trim function --> $.trim(singleWord)
	// change all list to lowercase
	for(var i=0; i<array.length; i++){
		array[i] = array[i].trim();
		array[i] = array[i].toLowerCase();
	}
	return array;
}

functions.lineByLineToArray = function(text) {
	// get line-by-line list and break into an array
	if(text) {
        text = text.replace(/\W/g, ' ');
        var keywordsArr = text.split(" ");
    }
    return keywordsArr;
	// var array =[];
	// if(text.search(',') !== -1){
	//     array = text.split(',');
	// } else {
	//     array = text.split('\n');
	// }
	return functions.cleanArray(keywordsArr);
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
  word = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

  // Replace any whitespace in `word` with `\s`, which matches any
  // whitespace character, including line breaks.
  word = word.replace(/\s+/g, '\\s');

  // Create a regex with our `word` that will match it as long as it
  // is surrounded by a word boundary (`\b`). A word boundary is any
  // character that isn't part of a word, like whitespace or
  // punctuation.
  var regex = new RegExp('\\b' + word + '\\b', 'gi');

  // Get all of the matches for `phrase` using our new regex.
  var matches = phrase.match(regex);
  
  // If some matches were found, return how many. Otherwise, return 0.
  return matches ? matches.length : 0;
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
	var array = functions.lineByLineToArray(list);
	array = functions.removeArrayDuplicates(array);
	dic = functions.countedKeywordsDic(array, text);
	return dic;
}

functions.replaceChar = function(text, fChar, dChar){
    return text.split(fChar).join(dChar);
}

//textToArray - the function get bunch of text and compile an array with each word as an object in the array
functions.getFirstWord = function(text) {
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


functions.textToArr = function(text){
	var regex = new RegExp();
	regex = /(?:(\w|'))/i;
	var arr=[];
	while(regex.test(text)){
		var word = functions.getFirstWord(text);
		arr.push(word);
		text = text.slice(text.search(regex)+word.length);
	}
	return arr;
}

functions.buildPhrases = function(wordsArr){
	var newArr = [];
	wordsArr.forEach(function(a){
		newArr.push(a);
		wordsArr.forEach(function(b){

			if(!functions.checkRep(a,b)){
				newArr.push(a+ " " + b);
			}
			wordsArr.forEach(function(c){
				if(!functions.checkRep(a,b,c)){
					newArr.push(a+ " " + b + " " + c);
				}
				wordsArr.forEach(function(d){
					if(!functions.checkRep(a,b,c,d)){
						newArr.push(a+ " " + b + " " + c + " " + d);
					}
					wordsArr.forEach(function(e){
						if(!functions.checkRep(a,b,c,d,e)){
							newArr.push(a+ " " + b + " " + c + " " + d + " " + e);
						}
					});
				});
			});
		});
	});
	return newArr;
}




functions.checkRep = function(a,b,c,d,e){
	var isRep = false;
	if(e && functions.compareEls([a,b,c,d],e)){
		return true;
	} else if(d && functions.compareEls([a,b,c],d)) {
		return true;
	} else if(c && functions.compareEls([a,b],c)){
		return true;
	} else if(b && functions.compareEls([a],b)){
		return true;
	} else return false;
}


// Return true if both are equal
functions.compareTwo = function(a,b,c,d,e){
	if(a===b){
		return true;
	}
	else return false;
}

functions.compareEls = function(arr,num){
	var isFound = false;
	arr.forEach(function(el){
		if(num === el){
			isFound =  true;
		}
	});
	return isFound;
}


functions.sortAppByOS = function(appObj){
	
    var regex = new RegExp();
	regex = /(?:(\D))/i;
    var iOS = {};
    var android = {};
    appObj = appObj["data"];
   
    for(var id in appObj) {
        var appName = appObj[id].appName;
        var mobileActionID = appObj[id].appId;
        if(regex.test(id)){
            android[appName] = mobileActionID;
        } else {
            iOS[appName] = mobileActionID;
        }
    }
    return {"iOS":iOS, "Android":android};
}


// get the app list from MA (only MA, any other service provider 
// will require refactoring this code), and return the apps names
// in an array
function appNamesListToArray(list){
	var arr =[];
	for (var appName in list) {
        arr.push(appName);
    }
    return arr;
}



module.exports = functions;