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
const archiveDB = ref(database, "archive");

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
  document.getElementById("text-input").value = "";
});

onValue(notesInDB, function (snapshot) {
  clearNotesList();
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearNotesList();

    for (let i = itemsArray.length - 1; i >= 0; i--) {
      console.log("here");
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

  let deleteEl = document.createElement("div");
  deleteEl.textContent = "X";
  deleteEl.classList.add("delete");

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;
  let dateEl = document.createElement("p");

  dateEl.textContent = timeStamp;
  dateEl.classList.add("date");

  deleteEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `notes/${itemID}`);
    push(archiveDB, { itemValue });

    remove(exactLocationOfItemInDB);
  });

  // @ts-ignore
  notesList.append(deleteEl, newEl, dateEl);
}
