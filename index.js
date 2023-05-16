// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  // @ts-ignore
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://wsk-bread-folds-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const timesInDB = ref(database, "times");

const breadInputFeild = document.getElementById("input-field");
const timeInputFeild = document.getElementById("fold-times");
const addButtonEl = document.getElementById("add-time-button");
const timerList = document.getElementById("timers-list");
let mySound = new Audio("assets/bell-ring.wav");

// @ts-ignore
addButtonEl.addEventListener("click", function () {
  // @ts-ignore
  let breadNameValue = breadInputFeild.value;
  let timeValue = timeInputFeild.value;
  let finishTime = Date.now() + timeValue * 60000;
  push(timesInDB, { breadNameValue, timeValue, finishTime });
  revertInputFeild();
});

onValue(timesInDB, function (snapshot) {
  clearTimersList();
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearTimersList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentObject = itemsArray[i];
      appendTimerToList(currentObject);
    }
  } else {
    // @ts-ignore
    timerList;
  }
});

function clearTimersList() {
  // @ts-ignore
  timerList.innerHTML = "";
}

function revertInputFeild() {
  // @ts-ignore
  breadInputFeild.value = "House";
}
function formatTime(millis) {
  if (millis > 0) {
    var minutes = Math.floor(millis / 60000);
    var seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return (
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds
    );
  } else {
    return "00:00";
  }
}

function appendTimerToList(item) {
  let itemID = item[0];
  let itemValue = item[1].breadNameValue;
  let itemFinishTime = item[1].finishTime;
  let currentTime = Date.now();
  let timeLeft = itemFinishTime - currentTime;
  let formattedTime = formatTime(timeLeft);
  let newEl = document.createElement("li");
  if (timeLeft < 0) {
    newEl.style.backgroundColor = "#D0342C ";
    newEl.style.color = "white";
    mySound.play();
  }

  newEl.textContent = itemValue + " - " + formattedTime;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `times/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  // @ts-ignore
  timerList.append(newEl);
  setInterval(() => {
    let currentTime = Date.now();
    let timeLeft = itemFinishTime - currentTime;
    let formattedTime = formatTime(timeLeft);
    if (timeLeft < 0) {
      newEl.style.backgroundColor = "#D0342C ";
      newEl.style.color = "white";
      mySound.play();
    }
    newEl.textContent = itemValue + " - " + formattedTime;
  }, 100);
}
