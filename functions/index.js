var express = require("express"),



app = express();



var functions = {};

functions.listToArray = function(text) {
	// get line-by-line list and break into an array
	var array = text.split('\n');

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




functions.addedChars = function(word){
    if (word.endsWith("!")){
        return true;
    }
    else if (word.endsWith(",")){
        return true;
    }
    else if (word.endsWith("+")){
        return true;
    }
    else if (word.endsWith(".")){
        return true;
    }
    else if (word.endsWith("?")){
        return true;
    }
    else if (word.endsWith(" ")){
        return true;
    }
    else if (word.endsWith(":")){
        return true;
    }
    else if (word.endsWith("'")){
        return true;
    }
    else {
        return false;
    }
}

functions.countWordInPhrase = function(word, phrase){
	var phrase = phrase.toLowerCase();
    var c = 0;
    var fChar = 0;
    var lChar = 0;
    while (fChar < phrase.length) {
    	if (phrase.charAt(fChar) === word.charAt(0)){
            lChar = fChar + 1;
            while (lChar < phrase.length){ 
            	
                if (phrase.substring(fChar,lChar) === word){
                    if(lChar+1 <phrase.length){
                        if(functions.addedChars(phrase.substring(fChar,lChar + 1))){
                            c += 1;
                            fChar = fChar + word.length-1;
                            break;
                        }
                    } else {
                        c += 1;
                        break;
                    }
                    
                	
                } 
                else if (lChar - fChar > word.length){
                	break;
                }
            lChar += 1;
        	}
        }
        fChar += 1;
    }   
    return c;
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

module.exports = functions;