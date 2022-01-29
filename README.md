# wordle-solver

A Hackey CLI solver for wordle 

Run as follows: 

1. Install [node.js](https://nodejs.org/en/) (optional: [yarn](https://yarnpkg.com/getting-started/install))
2. clone git repo
3. `yarn` (or `npm init` if you dont have yarn installed)
4. `yarn run start`(or (`npm run start`)

It will give you a suggested guess, and prompt you to tell it what you guessed e.g. irate and the score e.g. 12000 (0=Black, 1=Yellow, 2=Green)

It then narrows the word list and gives you the next guess

## How it works

### Inital Guess

First of all the program takes in two word lists, both taken from the wordle source code: 

- words_alpha.txt is the full list of words available as guesses in wordle
- words_cheat.txt is the list of all words avalable as answers in wordle
  
It then parses through the available guesses and creates a frequency chart for each of the 5 available letter positions. 

e.g. if you had three words in your list

* CARES
* CHOCO
* THREE

The scores would be ouput as follows:

* Position 1: C: 2, T: 1
* Position 2: A: 1, H: 2
* Position 3: R: 2, O: 1
* Position 4: E: 2, C: 1 
* Position 5: S: 1, O: 1, E: 1

From these position based frequencies, it gives each letter in each column a score based on the percentage that the letter occurs in that column. 

e.g.
* Position 1: C: 66, T: 33
* Position 2: A: 33, H: 66
* Position 3: R: 66, O: 33
* Position 4: E: 66, C: 33 
* Position 5: S: 33, O: 33, E: 33

It then sorts the words based on the above score, and for the initial word, it picks the one with the top score with no duplicate letters

* CARES = 264
* CHOCO = 231
* THREE = 264

Here it would pick CARES as the initial guess as it has no duplicate letters

## Remaining guesses

There are two filters which are set up, 
- a positive filter which contains details of all letters which we know are in the word, this knowledge is gained from any Green (score 2) and Yellow (Score 1) letters which have shown up when we score our guess in wordle
- a negative filter, this initially is set up for all available letters and will be amended as follows
  - any score of zero (Grey) will remove the letter from all available positions
  - any score of 1 (Yellow) will remove the letter from the postion it inhabits
  - any score of 2 (Green) will set that filter to be the correct letter 

There is a small adjustment required to the score in the case that there is a duplicate letter:

e.g. SORES

- If the score is 00000 then we know that the word does not contain S, scores do not need to be adjusted
- If the score is 00002 then again we know that the score does not need to be adjusted as there is one S and it is in the correct position
- If the score is 10000 then the score needs to be adjusted to 10001, this is because we know there is at least one S and we can elimiate two positions for that S. Leaving the S at 0 would eliminate it from the negative filter grid

The word list is filtered based on the filter grids above 
- word must contain all letters listed in the positive filter
- each position of the word must contain a letter in the negative filter
  
Then the scores for each letter and word are recalculated and the top scoring three words are presented to the user with the number of remaining words

The program will continue to filter the word lists until either a score of 22222 is obtained or the list of available answers only has one remaining word in it. 
