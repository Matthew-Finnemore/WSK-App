// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
  get,
  child
  // @ts-ignore
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://wsk-bread-folds-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const timesInDB = ref(database, "times");
const breadInputField = document.getElementById("input-field");
const timeInputField = document.getElementById("fold-times");
const addButtonEl = document.getElementById("add-time-button");
const timerList = document.getElementById("timers-list");
let mySound = new Audio("assets/bell-ring.wav");

// @ts-ignore
addButtonEl.addEventListener("click", function () {
  // @ts-ignore
  let breadNameValue = breadInputField.value;
  // @ts-ignore
  let timeValue = timeInputField.value;
  let finishTime = Date.now() + timeValue * 60000;
  let foldCounter = 1;
  push(timesInDB, { breadNameValue, timeValue, finishTime, foldCounter });
  revertInputField();
});

setInterval(() => {
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
}, 100);

function clearTimersList() {
  // @ts-ignore
  timerList.innerHTML = "";
}

function revertInputField() {
  // @ts-ignore
  breadInputField.value = "House";
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
  let breadName = item[1].breadNameValue;
  let itemFinishTime = item[1].finishTime;
  let currentTime = Date.now();
  let timeLeft = itemFinishTime - currentTime;
  let formattedTimeLeft = formatTime(timeLeft);
  let newEl = document.createElement("li");
  let foldInterval = item[1].timeValue;
  let foldCounter = item[1].foldCounter;
  newEl.textContent = elementContent(
    breadName,
    formattedTimeLeft,
    foldInterval,
    foldCounter
  );

  newEl.addEventListener("click", function () {
    let foldCounterDb = 0
    mySound.pause();
    let exactLocationOfItemInDB = ref(database, `times/${itemID}`);
    updateFoldCounter(foldCounterDb, exactLocationOfItemInDB)
    updateTimer(exactLocationOfItemInDB);
  });

  timerList.append(newEl);
   if (timeLeft < 0) {
     newEl.style.backgroundColor = "#D0342C ";
     newEl.style.color = "white";
     mySound.play();
   }
}

function elementContent(breadName, formattedTimeLeft, foldInterval, foldCounter) {
  let foldStep = ""
  if (foldCounter === 1) {
    foldStep = "fold 1";
  } else if (foldCounter === 2) {
    foldStep = "fold 2";
  } else if (foldCounter === 3) {
    foldStep = "fold 3";
  } else if (foldCounter === 4) {
    foldStep = "shaping";
  }
  return `${breadName} will need ${foldStep} in: ${formattedTimeLeft}.`;

}

const updateFoldCounter = (foldCounter, exactLocationOfItemInDB) => { 

get(child(exactLocationOfItemInDB, "foldCounter"))
  .then(function (snapshot) {
    if (snapshot.exists()) {
      if (snapshot.val() >= 4) {
        remove(exactLocationOfItemInDB);
        mySound.pause();
      } else {
        foldCounter = snapshot.val() + 1;
        update(exactLocationOfItemInDB, { foldCounter: foldCounter });
        return;
      }
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

const updateTimer = (exactLocationOfItemInDB) => { 
  get(exactLocationOfItemInDB)
  .then(function (snapshot) {
    if (snapshot.exists()) {
      if (snapshot.val().foldCounter <= 3) {
        const currentTime = Date.now();
        const foldInterval = snapshot.val().timeValue * 60000;
        const newFinishTime = currentTime + foldInterval;
        console.log(newFinishTime);
        update(exactLocationOfItemInDB, { finishTime: newFinishTime });
      }
      return
      
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
};
;