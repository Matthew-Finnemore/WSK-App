// @ts-nocheck
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
const notesInDB = ref(database, "notes");

const submitMessageButton = document.getElementById("message-button");
const notesList = document.getElementById("notes-list");

submitMessageButton.addEventListener("click", (e) => {
  e.preventDefault();
  const message = document.getElementById("text-input").value;
  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const dateString =
    currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;

  push(notesInDB, { message, dateString });
});

onValue(notesInDB, function (snapshot) {
  clearNotesList();
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearNotesList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentObject = itemsArray[i];
      appendNotesToList(currentObject);
    }
  } else {
    // @ts-ignore
    notesList;
  }
});

function clearNotesList() {
  // @ts-ignore
  notesList.innerHTML = "";
}

function appendNotesToList(item) {
  let itemID = item[0];
  let itemValue = item[1].message;
  let timeStamp = item[1].dateString;

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;
  let dateEl = document.createElement("li")
    
  dateEl.textContent = timeStamp;
  dateEl.classList.add("date");

  // newEl.addEventListener("click", function () {
  //   console.log("here clicked");
  //   let exactLocationOfItemInDB = ref(database, `notes/${itemID}`);
  //   remove(exactLocationOfItemInDB);
  // });

  // @ts-ignore
  notesList.append(newEl, dateEl);
}
