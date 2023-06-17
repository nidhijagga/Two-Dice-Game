const playElements = document.querySelectorAll(".play");
playElements.forEach(function (element) {
  element.style.display = "none";
});
document.getElementById("loading").style.display = "none";

let score0El = document.getElementById("score--0");
let score1El = document.getElementById("score--1");
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

  const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);
  
  if(foundObject.p1.p1name == `${name}`){
    oppName = foundObject.p2.p2name;
    name0El.textContent = name;
    name1El.textContent = oppName;
  }
  else{
    oppName = foundObject.p1.p1name;
    name0El.textContent = oppName;
    name1El.textContent = name;
  }

 
});


//Rolling the dice

btnRoll.addEventListener("click", (e)=>{
  const dice = Math.trunc(Math.random() * 6) + 1;
  socket.emit("dice", {dice : dice, name : name});
})

socket.on("dice", (e)=>{
  const allPlayersArray = e.allPlayers;
  const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);

  let you = foundObject.p1.p1name === name ? "p1" : "p2";
  diceEl.style.display = "block";
  
  if (foundObject.currentPlayed === name) {
    diceEl.src = `/img/dice-${you === "p1" ? foundObject.p1.p1dice : foundObject.p2.p2dice}.png`;

    you === "p1" ? (current0El.textContent = foundObject.p1.p1current) : (current1El.textContent = foundObject.p2.p2current);


  } else {
    diceEl.src = `/img/dice-${you === "p1" ? foundObject.p2.p2dice : foundObject.p1.p1dice}.png`;

    you === "p1" ? (current1El.textContent = foundObject.p2.p2current) : (current0El.textContent = foundObject.p1.p1current);

  }
  
})

