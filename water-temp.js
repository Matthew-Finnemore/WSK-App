const button = document.getElementById("calc-temp");
const flourTemp = document.getElementById("flour-temp");
const roomTemp = document.getElementById("room-temp");
const resultDisplay = document.getElementById("result-temp");
const currentTempEl = document.getElementById("current-temp");
const maxTempEl = document.getElementById("max-temp");
const baseTemp = 68;
const apiKey = "61fe5a07dcecfd73943bd78de8fdeaff";
let currentTemp = 0;
let maxTemp = 0;
const lat = 52.284928506462876;
const lon = -1.5791504656251625;

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    currentTemp = Math.round(data.main.temp);
    maxTemp = Math.round(data.main.temp_max);
    setTemperatures(currentTemp, maxTemp);
  });

button.addEventListener("click", (e) => {
  e.preventDefault();
  calculateTemp();
});

function calculateTemp() {
  if (flourTemp.value && roomTemp.value) {
    const numberFlourTemp = Number(flourTemp.value);
    const numberRoomTemp = Number(roomTemp.value);
    const waterTemp = baseTemp - (numberFlourTemp + numberRoomTemp);
    resultDisplay.textContent = `${waterTemp}`;
  } else {
    resultDisplay.textContent = "Input Temps";
  }
}
function setTemperatures(currentTemp, maxTemp) {
  if (currentTemp && maxTemp) {
    currentTempEl.textContent = currentTemp;
    maxTempEl.textContent = maxTemp;
  }
}
