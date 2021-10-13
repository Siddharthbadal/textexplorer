//  loading the books on server

function loadBook(filename, displayName){
    let currentBook = "";
    let url = "books/" + filename;

    // reset the dispaly
    document.getElementById("fileName").innerHTML = displayName
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    //  server request to load our book
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
            currentBook = xhr.responseText;
            getDocStats(currentBook)

            //  removing the line breaks and returns, replace these with </br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>')

            document.getElementById("fileContent").innerHTML = currentBook;

            let elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;
        }
    };

}

//  fetching different HTML ids
function getDocStats(fileContent){
    const docLength = document.getElementById("docLength")
    const wordCount = document.getElementById("wordCount")
    const charCount = document.getElementById("charCount")

    let text = fileContent.toLowerCase();
    // matches spaces and count words betwen two spaces.
    let textArray = text.match(/\b\S+\b/g);
    let textObj = {};

    let unCommonWords = [];
    unCommonWords = filterStopWords(textArray)


    //  counting words in textArray
    for(let word in unCommonWords){
        let wordValue = unCommonWords[word]
        if(textObj[wordValue] > 0){
            textObj[wordValue] += 1
        } else{
            textObj[wordValue] = 1;
        }
        
        // sorting the text obj
        let wordList = sortProperties(textObj)
        //  finding top and least occurance
        let topWords = wordList.slice(0, 6);
        let leastWords = wordList.slice(-6, wordList.length)
        
        
        //  passing data to ultemplate function to send to html
        ulTemplate(topWords, document.getElementById("mostUsedWords"))

        ulTemplate(leastWords, document.getElementById("leastUsedWords"))

        docLength.innerText = `Document Length  ${text.length}`
        wordCount.innerText = `Words Count ${textArray.length}`
    }
}

// 
function ulTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";
    

    for (i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
     
        element.innerHTML = resultsHTML;
}
}

//  sorting the above text array
function sortProperties(obj){
    let rtnArray = Object.entries(obj);
    rtnArray.sort(function(f, s){
        return s[1] - f[1];
    });
    return rtnArray;
}

//  filering stop words
function filterStopWords(wordArray){
    let commonWords = getStopWords();
    let commonObj = {};
    let unCommonArray = [];

    for (let i=0; i<commonWords.length; i++){
        commonObj[commonWords[i].trim()] =true;
    }
    for (i=0; i<wordArray.length; i++){
        word = wordArray[i].trim().toLowerCase()
        if(!commonObj[word]){
            unCommonArray.push(word);
        }
    }
    return unCommonArray
}

//  searching and marking the text in main file
function performMark(){

    let keyword = document.getElementById("keyword").value;
    let display = document.getElementById("fileContent");

    let spans = document.querySelectorAll("mark")

    // marking the entered text
    for(var i = 0; i< spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }
    let re = new RegExp(keyword, "gi");
    let replaceText = "<b><mark id='markMe'>$&</mark></b>"
    let bookContent = display.innerHTML;

    newContent = bookContent.replace(re, replaceText)

    display.innerHTML = newContent;
    let count = document.querySelectorAll('mark').length;

    document.getElementById("searchstat").innerHTML = `found ${count} matches`

    if (count > 0){
        let el = document.getElementById("markMe")
        el.scrollIntoView();
        
    }
    
}

