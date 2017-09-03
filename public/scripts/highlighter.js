

// Get the div that in which we put the text
var textOutput = document.getElementById("textOutput");

//get the keywordsList
var keywordsList = document.getElementById("keywordsList");

//get the descField
var descField = document.getElementById("descField");

//get the submit button to highlight tyhe keywords
var highlightKeys = document.getElementById("highlightKeys");

// make textOutput has the value of the Description Field
function setTextOutput(){
	textOutput.innerText = descField.value;
}

function highlight(){
    setTextOutput();
    mark();
    replaceMarkTags();
    // // Edit the label to the text appear
	var textOutputLabel=document.querySelector("label[for=textOutput]");
	textOutputLabel.innerText = "Hihglighted Description:"
}

function mark(){
    var instance = new Mark(textOutput);
    instance.mark(seperateKeywords(keywordsList.value), {
        "className": "highlight"
    });
}

//Seperate a list of keywords in any kind to be an array of keywords	
function seperateKeywords(keywords) {
    if(keywords) {
        keywords = keywords.replace(/\W/g, ' ');
        var str = keywords.split(" ");
    }
    return str;
}

function replaceMarkTags(){
    var marks = document.getElementsByTagName("mark");
    while (marks.length !== 0){
        for(var i=0; i<marks.length; i++){
    		var inner = marks[i].innerText;
            var el = marks[i];
            el.outerHTML = "<span class='highlight'>" + inner + "</span>";
    	}
    	marks = document.getElementsByTagName("mark");
    }
	
}
