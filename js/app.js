//create list that holds all cards, toggle and untoggle them.
const deck = document.querySelector('.deck');
let card = document.getElementsByClassName('card');

// arrays for cards
let cardsArray = [...card];
let toggledCards = [];


// scorePanel and final scoreCard variables
let moves = 0;
let second = 0;
let minute = 0;
let interval;
let timerRunning = false;
let timer = document.querySelector('.timer');
let matched = 0;
let starsArray = document.querySelectorAll(".stars li");

//hide score card on load
toggleScore();

//shuffle all cards in the deck
function shuffleCards() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleCards();

// click event to start score panel, add toggled cards to list -
//check for match, add move to score panel,
//change stars display if above threshold

deck.addEventListener('click', event => {
  startTimer();
  const clickTarget = event.target;
  if (validClick(clickTarget)) {
    toggleCard(clickTarget);
    addToggleCard(clickTarget);
    if (toggledCards.length === 2) {
      cardsMatch(clickTarget);
      addMove();
      scoreStarsChange();
    }
  }
});

//set click target

function validClick(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

//toggle cards open

function toggleCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}

// add toggled cards to array

function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
}

//check to see if cards are matching, if not turn over after 1000 milliseconds
// if yes, then keep toggled
//when all cards are toggled, the game is won and scorecard displays after 500milliseconds

function cardsMatch() {
  if (
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matched++;
    if (matched === 8) setTimeout(() => {
      gameOver();
    }, 500);
  } else {
    setTimeout(() => {
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 1000);
  }
}

//increment moves on score panel

function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

//change stars display

function scoreStarsChange() {
  if (moves < 15) {
    //display 3 stars
  } else if (moves >= 15 && moves <= 20) {
    //display 2 stars
    starsArray[0].getElementsByTagName('i')[0].classList.remove("fa-star");
    starsArray[0].getElementsByTagName('i')[0].classList.add("fa-star-o");
  } else {
    //display 1 star
    starsArray[0].getElementsByTagName('i')[0].classList.remove("fa-star");
    starsArray[0].getElementsByTagName('i')[0].classList.add("fa-star-o");
    starsArray[1].getElementsByTagName('i')[0].classList.remove("fa-star");
    starsArray[1].getElementsByTagName('i')[0].classList.add("fa-star-o");
  }
}

// set timer for score panel

function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    second = 0;
    minute = 0;
    interval = setInterval(function() {
      second++;
      timer.innerHTML = minute + " mins " + second + " secs";
      if (second == 60) {
        minute++;
        second = 0;
      }
    }, 1000);
  }
}

//stop timer

function stopTimer() {
  if (timerRunning) {
    timerRunning = false;
    clearInterval(interval);
  }
}

// score card on and off

function toggleScore() {
  const score = document.querySelector('.scoreBackground');
  score.classList.toggle('hide');
}

//score stats for final score card

function scoreCardStats() {

  const timeStat = document.querySelector('.scoreTime');
  const clockTime = document.querySelector('.timer').innerHTML;
  const movesStat = document.querySelector(".scoreMoves");
  const movesCount = document.querySelector('.moves').innerHTML;
  const starsStat = document.querySelector('.scoreStars');
  const starCount = document.querySelector(".stars").innerHTML;

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${movesCount}`;
  starsStat.innerHTML = `Stars = ${starCount}`;
};

//close final score card and restart game with x via reload

let close = document.querySelector('.xOut');
close.addEventListener('click', () => {
  window.location.reload(true);
});

//restart game with restart on score panel via reload

let restart = document.querySelector('.restart');
restart.addEventListener('click', () => {
  window.location.reload(true);
});

//close score card with cancel and restart game via reload

let cancel = document.querySelector('.scoreCancel');
cancel.addEventListener('click', () => {
  resetGame();
  window.location.reload(true);
});

// close score card with replay and restart game via reload

let replay = document.querySelector('.scoreReplay');
replay.addEventListener('click', () => {
  window.location.reload(true);
});

//reset clock to zero

function resetClock() {
  stopTimer();
  timerRunning = false;
  second = 0;
  minute = 0;
  let timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);
}

//reset moves to zero

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

//reset stars to 3

function resetStars() {
  starsArray[0].getElementsByTagName('i')[0].classList.remove("fa-star-o");
  starsArray[0].getElementsByTagName('i')[0].classList.add("fa-star");
  starsArray[1].getElementsByTagName('i')[0].classList.remove("fa-star-o");
  starsArray[1].getElementsByTagName('i')[0].classList.add("fa-star");
  starsArray[2].getElementsByTagName('i')[0].classList.remove("fa-star-o");
  starsArray[2].getElementsByTagName('i')[0].classList.add("fa-star");
}

// turn cards over on reset

function turnCardsOver() {
  for (let i = 0; i < cardsArray.length; i++) {
    cardsArray[i].classList.remove("show", "open", "match", "disabled");
  }
}

//reset game

function resetGame() {
  resetClock();
  resetMoves();
  resetStars();
  shuffleCards();
  turnCardsOver();
  toggleScore();
}

//game is won, timer stops, scores are written, score card toggles

function gameOver() {
  stopTimer();
  scoreCardStats();
  toggleScore();
};

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */