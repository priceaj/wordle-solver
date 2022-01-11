let fs = require('fs');
let prompt = require('prompt-sync') ({sigint: true});

let wordarray = fs.readFileSync('words_alpha.txt').toString().split("\n").filter(x => x.trim().length === 5);

for (i in wordarray){
    wordarray[i] = wordarray[i].replace('\r','');
}

function scoreword(word) {

    //TODO Parse disctionary and work out scores
    let letterscores = [
        {Letter: 'e', Score: 26},
        {Letter: 'a', Score: 25},
        {Letter: 'r', Score: 24},
        {Letter: 'i', Score: 23},
        {Letter: 'o', Score: 22},
        {Letter: 't', Score: 21},
        {Letter: 'n', Score: 20},
        {Letter: 's', Score: 19},
        {Letter: 'l', Score: 18},
        {Letter: 'c', Score: 17},
        {Letter: 'u', Score: 16},
        {Letter: 'd', Score: 15},
        {Letter: 'p', Score: 14},
        {Letter: 'm', Score: 13},
        {Letter: 'h', Score: 12},
        {Letter: 'g', Score: 11},
        {Letter: 'b', Score: 10},
        {Letter: 'f', Score: 9},
        {Letter: 'y', Score: 8},
        {Letter: 'w', Score: 7},
        {Letter: 'k', Score: 6},
        {Letter: 'v', Score: 5},
        {Letter: 'x', Score: 4},
        {Letter: 'z', Score: 3},
        {Letter: 'j', Score: 2},
        {Letter: 'q', Score: 1}
    ]

    let score = 0;

    for (i in word)
    {
        let currentletter = letterscores.find(({Letter,Score}) => Letter === word[i]);
        score += currentletter.Score;
    }

    return score
}

wordarray.sort((a,b) => scoreword(b.trim()) - scoreword(a.trim())  )

let wordarraynodupes = wordarray.filter(x => !hasduplicatedchars(x));

function hasduplicatedchars(word){
    
    for (i in word){
        if (word.indexOf(word[i]) !== word.lastIndexOf(word[i])){

            return true
        }
     
    }
    return false
}

console.log("Starting Word:", wordarraynodupes[0], wordarraynodupes[1], wordarraynodupes[2]);

let score = 0

let filter = [['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']]

do {
let word = prompt('What was your word?: ');
 score = prompt('What was the score?: ');



 function getFrequency(string) {
    var freq = {};
    for (var i=0; i<string.length;i++) {
        var character = string.charAt(i);
        if (freq[character]) {
               freq[character]++;
        } else {
               freq[character] = 1;
        }
    }

        return freq;
    };

 //TODO loop through scores and adjust score to 1 if the letter is repeated and has zero score
function adjustscore(word, score) {
    var newscore = [];
    let frequency = getFrequency(word);
    for (let x in word){
        if (frequency[word[x]] > 1){
           if ((score[x] == 0) && (gethighestscore(word,score,word[x]) > 0)){
               newscore[x] = '1';
           } else {newscore[x] = score[x];
            }
        } else {
            newscore[x] = score[x];
        }
    }
    return newscore;
}

function gethighestscore(word, score, letter){

    let newscore = 0;
for (let x in word){
    if (word[x] == letter){
       if (score[x] > newscore){
           newscore = score[x];
       }

    }
}
return newscore
}

if (score != '22222'){
score = adjustscore(word, score)
}

function updatefilters(word,score,filter){

    for (i in word) {
        if (score[i] == 0){
          //remove letter from all arrays which have length > 1
          

          for (let j = 0; j < 5; j++){
             if (filter[j].length > 1){

 
                filter[j] = filter[j].filter(x => x != word[i]) ;
                
                }
          }

        }
        if (score[i] == 1){
          // Remove the letter from that box but not from any others
          filter[i] = filter[i].filter(x => x != word[i])
 
        }
        if (score[i] == 2){
          //set filter equal to  letter 
          filter[i] = [word[i]];
        }
      }
      
      return filter;
}

filter = updatefilters(word,score,filter);

function filterwordarray(wordarray,filter){

   wordarray = wordarray.filter(word => checkfilters(word,filter));
   wordarray.sort((a,b) => scoreword(b.trim()) - scoreword(a.trim())  )
   return wordarray;
}

function checkfilters(word,filter){ 
        for (letter in word) {  
            if (filter[letter].indexOf(word[letter]) == -1)
            return false
        }
        return true
    
}



wordarray = filterwordarray(wordarray, filter);
console.log ("Next Guess: ", wordarray[0], wordarray[1], wordarray[2])
}
while (score != 22222)

console.log('Congratulations!')