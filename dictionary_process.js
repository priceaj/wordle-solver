let fs = require('fs');
let prompt = require('prompt-sync') ({sigint: true});

let wordarray = fs.readFileSync('words_cheat.txt').toString().split("\r\n").filter(x => x.trim().length === 5);
let totalfrequency = {}

function getFrequency(string) {
    var freq = [];
    for (var i=0; i<string.length;i++) {
        var character = string.charAt(i);
        var elementIndex = freq.findIndex((obj) => obj.Letter === character);
        if (elementIndex == -1){
            freq.push({"Letter": character, "Total": 1})
        } else {
            freq[elementIndex].Total++;
        }

    }

     freq.sort((a,b) => a.Total - b.Total  );
     var count = 0; 
     for (let x in freq){
         count++;
         //TODO which is better?!?
         freq[x].Score = count;
         //freq[x].Score = freq[x].Total;
     }

     return freq
    };


    totalfrequency = getFrequency(wordarray.join(''))

    
function scoreword(word, letterscores) {

    let score = 0;

    for (let i in word)
    {
        let currentletter = letterscores.find(({Letter,Score}) => Letter === word[i]);
        score += currentletter.Score;
    }

    return score
}

wordarray.sort((a,b) => scoreword(b.trim(),totalfrequency) - scoreword(a.trim(),totalfrequency)  )

let wordarraynodupes = wordarray.filter(x => !hasduplicatedchars(x));

function hasduplicatedchars(word){
    
    for (let i in word){
        if (word.indexOf(word[i]) !== word.lastIndexOf(word[i])){

            return true
        }
     
    }
    return false
}

console.log("Starting Words:", wordarraynodupes[0], wordarraynodupes[1], wordarraynodupes[2]);

let score = 0

let negativefilter = [['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
              ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']]

              let guaranteedletters = [];

do {
let word = prompt('What was your word?: ');
 score = prompt('What was the score?: ');



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

function updatefilters(word,score,filter,guaranteedletters){

    for (let i in word) {
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

          guaranteedletters.push(word[i]);
        }
        if (score[i] == 2){
          //set filter equal to  letter 
          filter[i] = [word[i]];
          guaranteedletters.push(word[i]);

        }
      }
      return filter, guaranteedletters;
}

negativefilter, guaranteedletters = updatefilters(word,score,negativefilter, guaranteedletters);

function filterwordarray(wordarray,filter){

   wordarray = wordarray.filter(word => checkfilters(word,filter));
   
   return wordarray;
}

function checkfilters(word,filter){ 
        for (let letter in word) {  
            if (filter[letter].indexOf(word[letter]) == -1)
            return false
        }
        return true
    
}

wordarray = filterwordarray(wordarray, negativefilter);
wordarray = wordarray.filter(word => guaranteedletters.every(letter => word.includes(letter)))
console.log(wordarray);
totalfrequency = getFrequency(wordarray.join(''))
wordarray.sort((a,b) => scoreword(b.trim(),totalfrequency) - scoreword(a.trim(),totalfrequency)  )



console.log ("Next Guess: ", wordarray[0], wordarray[1], wordarray[2])
}
while (score != 22222)

console.log('Congratulations!')