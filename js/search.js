// WEATHER APP LOGIC

// FETCH THE WEATHER DATA FROM API
const fetchWeather = async () => {
  const city = document.querySelector("#city").value.toLowerCase();
  const country = document.querySelector("#country").value.toLowerCase();

  try {
    const API_KEY = "cf701ba1fa0b6880bd6c1a3d23e41be5";
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const api_call = await fetch(
      `${proxy}https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
    );

    const response = await api_call.json();

    displayResults(response);
  } catch (error) {
    console.log(error);
  }
};

// DISPLAY THE WEATHER RESPONSE
const displayResults = response => {
  const container = document.querySelector(".container");

  if (response.main) {
    container.innerHTML = `
    <div><span>Temperature:</span> ${response.main.temp}°c</div>
    <div><span>Humidity:</span> ${response.main.humidity}</div>
    <div><span>Weather:</span> ${response.weather[0].main} </div>
    <div><span>Description:</span> ${response.weather[0].description}</div>
    `;
  } else if (response.offline) {
    console.log(response.offline);
    container.innerHTML = `
    <div class="offline">
      <h1>${response.offline.title}</h1>
      <p>${response.offline.msg}</p>
    </div>`;
  } else {
    container.innerHTML = `<div class="error">Enter a valid city and country</div>`;
  }
};

// REGISTER THE SERVICEWORKER FOR PWA CAPABILITIES
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(registration => {
        console.log("{serviceWorker} registered");
      })
      .catch(err => {
        console.log("There was an error");
      });
  }
});

// CALL FETCHWEATHER FUNCTION WHEN BUTTON IS CLICKED
const button = document.querySelector("#search");
button.addEventListener("click", e => {
  e.preventDefault();

  fetchWeather();
});