const playElements = document.querySelectorAll(".play");
playElements.forEach(function (element) {
  element.style.display = "none";
});
document.getElementById("loading").style.display = "none";

let score0El = document.getElementById("score--0");
let score1El = document.getElementById("score--1");
let player0El = document.querySelector(".player--0");
let player1El = document.querySelector(".player--1");
let name0El = document.getElementById("name--0");
let name1El = document.getElementById("name--1");
let current0El = document.getElementById("current--0");
let current1El = document.getElementById("current--1");
let diceEl = document.querySelector(".dice");
let btnNew = document.querySelector(".btn--new");
let btnRoll = document.querySelector(".btn--roll");
let btnHold = document.querySelector(".btn--hold");

const socket = io();

//Finding the Players

let name;

document.getElementById("searchBtn").addEventListener("click", function () {
  name = document.getElementById("name").value;
  // document.getElementById("user").innerHTML = name;

  if (name === null || name === " " || name.length > 9) {
    alert("Enter a valid name (No. of characters should between 1 to 9)");
  } else {
    //Sending the name to server
    socket.emit("find", { name: name });
    document.getElementById("loading").style.display = "block";
    document.getElementById("find").style.display = "none";
  }
});

socket.on("find", (e) => {
  let allPlayersArray = e.allPlayers;

  if (name != "") {
    document.getElementById("search").remove();

    playElements.forEach(function (element) {
      element.style.display = "block";
    });

    diceEl.style.display = "none";
  }

  let oppName;

  const foundObject = allPlayersArray.find(
    (obj) => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`
  );

  if (foundObject.p1.p1name == `${name}`) {
    oppName = foundObject.p2.p2name;
    name0El.textContent = name;
    name1El.textContent = oppName;
  } else {
    oppName = foundObject.p1.p1name;
    name0El.textContent = oppName;
    name1El.textContent = name;

    //Getting rid of working of buttons when not your turn.
    btnRoll.disabled = true;
    btnHold.disabled = true;
  }
});

//Rolling the dice

btnRoll.addEventListener("click", (e) => {
  const dice = Math.trunc(Math.random() * 6) + 1;
  socket.emit("dice", { dice: dice, name: name });
});

socket.on("dice", handleDiceEvent);

function handleDiceEvent(eventData) {
  const allPlayersArray = eventData.allPlayers;
  const foundObject = findPlayerByName(allPlayersArray, name);

  const currentPlayer = foundObject.p1.p1name === name ? "p1" : "p2";
  diceEl.style.display = "block";

  let activeStatus = true;

  if (foundObject.currentPlayed === name) {
    const currentDice = currentPlayer === "p1" ? foundObject.p1.p1dice : foundObject.p2.p2dice;
    const currentScoreEl = currentPlayer === "p1" ? current0El : current1El;

    diceEl.src = `/img/dice-${currentDice}.png`;
    currentScoreEl.textContent = foundObject[currentPlayer][currentPlayer + "current"];
    activeStatus = foundObject[currentPlayer][currentPlayer + "status"];

    if (!activeStatus) {
      toggleActivePlayers();
      disableButtons();
    }
  } else {
    const otherPlayer = currentPlayer === "p1" ? "p2" : "p1";
    const otherDice = currentPlayer === "p1" ? foundObject.p2.p2dice : foundObject.p1.p1dice;
    const otherScoreEl = currentPlayer === "p1" ? current1El : current0El;

    diceEl.src = `/img/dice-${otherDice}.png`;
    otherScoreEl.textContent = foundObject[otherPlayer][otherPlayer + "current"];
    activeStatus = foundObject[otherPlayer][otherPlayer + "status"];

    if (!activeStatus) {
      toggleActivePlayers();
      enableButtons();
    }
  }
}


//Holding the number

btnHold.addEventListener("click", () => {
  socket.emit("hold", { name: name });
});

socket.on("hold", handleHoldEvent);

function handleHoldEvent(eventData) {
  const allPlayersArray = eventData.allPlayers;
  const foundObject = findPlayerByName(allPlayersArray, name);
  
  toggleActivePlayers();

  let currentPlayer = foundObject.p1.p1name === name ? "p1" : "p2";
  
  if (foundObject.currentPlayed === name) {
    disableButtons();

    updateScoreUI(foundObject, currentPlayer);
    checkWinCondition(foundObject, currentPlayer);
  } else {
    enableButtons();

    const otherPlayer = currentPlayer === "p1" ? "p2" : "p1";
    updateScoreUI(foundObject, otherPlayer);
    checkWinCondition(foundObject, otherPlayer);
  }
}

function findPlayerByName(allPlayersArray, playerName) {
  return allPlayersArray.find(
    (obj) => obj.p1.p1name === playerName || obj.p2.p2name === playerName
  );
}

function toggleActivePlayers() {
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
}

function disableButtons() {
  btnRoll.disabled = true;
  btnHold.disabled = true;
}

function enableButtons() {
  btnRoll.disabled = false;
  btnHold.disabled = false;
}

function updateScoreUI(foundObject, player) {
  const playerEl = player === "p1" ? player0El : player1El;
  const currentEl = player === "p1" ? current0El : current1El;
  const scoreEl = player === "p1" ? score0El : score1El;
  const playerCount = foundObject[player][player + "count"];
  
  currentEl.textContent = 0;
  scoreEl.textContent = playerCount;
}

function checkWinCondition(foundObject, player) {
  const playerEl = player === "p1" ? player0El : player1El;
  const playerCount = foundObject[player][player + "count"];
  
  if (playerCount >= 100) {
    playerEl.classList.remove("player--active");
    playerEl.classList.add("player--winner");
    hideButtons();
  }
}

function hideButtons() {
  btnRoll.style.display = "none";
  btnHold.style.display = "none";
}

//New Game
btnNew.addEventListener("click", ()=>{
  location.reload();
})