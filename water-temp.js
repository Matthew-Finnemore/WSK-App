const button = document.getElementById("calc-temp");
const flourTemp = document.getElementById("flour-temp");
const roomTemp = document.getElementById("room-temp");
const resultDisplay = document.getElementById("result-temp");
const currentTempEl = document.getElementById("current-temp");
const maxTempEl = document.getElementById("max-temp");
const baseTemp = 68;
const apiKey = "3ed3b16730dc48c789281817232305 ";
let currentTemp = 0
let maxTemp = 0

const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey} &q=cv344nt&days=1&aqi=no&alerts=no`;


fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    currentTemp = data.current.temp_c;
    maxTemp = data.forecast.forecastday[0].day.maxtemp_c;
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