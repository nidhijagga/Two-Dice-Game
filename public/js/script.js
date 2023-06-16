const playElements = document.querySelectorAll(".play");
playElements.forEach(function (element) {
  element.style.display = "none";
});
document.getElementById("loading").style.display = "none";

const score0El = document.getElementById("score--0");
const score1El = document.getElementById("score--1");
const diceEl = document.querySelector(".dice");

const socket = io();

let name;

document.getElementById("searchBtn").addEventListener("click", function () {
  name = document.getElementById("name").value;
  // document.getElementById("user").innerHTML = name;

  if (name === null || name === " ") {
    alert("Enter a valid name");
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
  let value;

  // const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);
  // foundObject.p1.p1name == `${name}` ? oppName = foundObject.p2.p2name : oppName = foundObject.p1.p1name
  // foundObject.p1.p1name == `${name}` ? value = foundObject.p1.p1value : value = foundObject.p2.p2value

  // document.getElementById("oppName").innerText = oppName
  // document.getElementById("value").innerText = value
});
