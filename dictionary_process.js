let fs = require('fs');
let prompt = require('prompt-sync')({ sigint: true });

let wordarray = fs.readFileSync('words_alpha.txt').toString().split("\r\n").filter(x => x.trim().length === 5);
let cheatarray = fs.readFileSync('words_cheat.txt').toString().split("\r\n").filter(x => x.trim().length === 5);
let totalfrequency = {}

totalfrequency = getFrequency(wordarray.join(''))
wordarray.sort((a, b) => scoreword(b.trim(), totalfrequency) - scoreword(a.trim(), totalfrequency))
let wordarraynodupes = wordarray.filter(x => !hasduplicatedchars(x));
console.log("Starting Words of", wordarray.length, "remaining words:", wordarraynodupes[0], wordarraynodupes[1], wordarraynodupes[2]);

let score = 0
let guaranteedletters = [];
let negativefilter = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']]

do {
    let word = prompt('What was your word?: ');
    score = prompt('What was the score?: ');

    if (score != '22222') {
        score = adjustscore(word, score)
    }

    negativefilter, guaranteedletters = updatefilters(word, score, negativefilter, guaranteedletters);

    wordarray = filterwordarray(wordarray, negativefilter);
    wordarray = wordarray.filter(word => guaranteedletters.every(letter => word.includes(letter)))

    cheatarray = filterwordarray(cheatarray, negativefilter);
    cheatarray = cheatarray.filter(word => guaranteedletters.every(letter => word.includes(letter)))
    totalfrequency = getFrequency(wordarray.join(''))
    wordarray.sort((a, b) => scoreword(b.trim(), totalfrequency) - scoreword(a.trim(), totalfrequency))

    let cheatfrequency = getFrequency(cheatarray.join(''))
    cheatarray.sort((a, b) => scoreword(b.trim(), cheatfrequency) - scoreword(a.trim(), cheatfrequency))

    if (cheatarray.length == 1) {
        console.log("Answer: ", cheatarray[0])
        score = '22222';
    } else {
        if (score == '00000') {
            let wordarraynodupes = wordarray.filter(x => !hasduplicatedchars(x));
            console.log("Next Guess of", wordarraynodupes.length, "remaining words:", wordarraynodupes[0], wordarraynodupes[1], wordarraynodupes[2])
        } else {
            console.log("Next Guess of", wordarray.length, "remaining words:", wordarray[0], wordarray[1], wordarray[2])
        }
    }
}
while (score != '22222')

console.log('Congratulations!')

function getFrequency(string) {
    var freq = [];
    for (var i = 0; i < string.length; i++) {
        var character = string.charAt(i);
        var elementIndex = freq.findIndex((obj) => obj.Letter === character);
        if (elementIndex == -1) {
            freq.push({ "Letter": character, "Total": 1 })
        } else {
            freq[elementIndex].Total++;
        }

    }

    freq.sort((a, b) => a.Total - b.Total);
    var count = 0;
    for (let x in freq) {
        count++;
        freq[x].Score = count;
    }

    return freq
}

function scoreword(word, letterscores) {

    let score = 0;

    for (let i in word) {
        let currentletter = letterscores.find(({ Letter }) => Letter === word[i]);
        score += currentletter.Score;
    }

    return score
}

function hasduplicatedchars(word) {

    for (let i in word) {
        if (word.indexOf(word[i]) !== word.lastIndexOf(word[i])) {

            return true
        }

    }
    return false
}

function filterwordarray(wordarray, filter) {

    wordarray = wordarray.filter(word => checkfilters(word, filter));

    return wordarray;
}

function checkfilters(word, filter) {
    for (let letter in word) {
        if (filter[letter].indexOf(word[letter]) == -1)
            return false
    }
    return true

}

function updatefilters(word, score, filter, guaranteedletters) {

    for (let i in word) {
        if (score[i] == 0) {
            //remove letter from all arrays which have length > 1


            for (let j = 0; j < 5; j++) {
                if (filter[j].length > 1) {


                    filter[j] = filter[j].filter(x => x != word[i]);

                }
            }

        }
        if (score[i] == 1) {
            // Remove the letter from that box but not from any others
            filter[i] = filter[i].filter(x => x != word[i])
            if (!guaranteedletters.includes(word[i])){guaranteedletters.push(word[i])}
            
        }
        if (score[i] == 2) {
            //set filter equal to  letter 
            filter[i] = [word[i]];
            if (!guaranteedletters.includes(word[i])){guaranteedletters.push(word[i])}
        }
    }
    return filter, guaranteedletters;
}

//loop through scores and adjust score to 1 if the letter is repeated and has zero score
function adjustscore(word, score) {
    var newscore = [];
    let frequency = getFrequency(word);
    for (let x in word) {
        if (frequency.find(y => y.Letter === word[x]).Total > 1) {
            // Originally gethighestscore > 0, however I believe this should be == 1
            // if there is is a correctly placed letter with a duplicate
            // wordle should give you a correct score for the second letter 
            if ((score[x] == 0) && (gethighestscore(word, score, word[x]) == 1)) {
                newscore[x] = '1';
            } else {
                newscore[x] = score[x];
            }
        } else {
            newscore[x] = score[x];
        }
    }
    return newscore.join('');
}

function gethighestscore(word, score, letter) {

    let newscore = 0;
    for (let x in word) {
        if (word[x] == letter) {
            if (score[x] > newscore) {
                newscore = score[x];
            }

        }
    }
    return newscore
}