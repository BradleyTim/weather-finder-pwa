// WEATHER APP LOGIC

// FETCH THE WEATHER DATA FROM API
const fetchWeather = async () => {
  const city = document.querySelector("#city").value.toLowerCase();
  const country = document.querySelector("#country").value.toLowerCase();

  const container = document.querySelector(".container");
  const loading = document.createElement("img");
  loading.classList.add("loader");
  loading.src = "/images/loading.gif";
  container.appendChild(loading);

  try {
    const API_KEY = "cf701ba1fa0b6880bd6c1a3d23e41be5";
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const api_call = await fetch(
      `${proxy}https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
    );

    const response = await api_call.json();
    loading.style.display = 'none';
    displayResults(response);
  } catch (error) {
    console.log(error);
  }
};

// DISPLAY THE WEATHER RESPONSE
const displayResults = response => {
  const container = document.querySelector(".container");

  if (response.main) {
    const descriptionDiv = document.createElement("div");
    descriptionDiv.textContent = `Description: ${response.weather[0].description}`;

    const summaryDiv = document.createElement("div");
    summaryDiv.textContent = `Weather: ${response.weather[0].main}`;

    const tempDiv = document.createElement("div");
    tempDiv.textContent = `Temperature: ${response.main.temp}°c`;

    const humidityDiv = document.createElement("div");
    humidityDiv.textContent = `Humidity: ${response.main.humidity}`;

    container.appendChild(descriptionDiv);
    container.appendChild(summaryDiv);
    container.appendChild(tempDiv);
    container.appendChild(humidityDiv);
    
  } else if (response.offline) {
    const div = document.createElement("div");
    dispatchEvent.classList.add("offline");

    const h1 = document.createElement("h1");
    h1.textContent = data.offline.title;

    const p = document.createElement("p");
    p.textContent = data.offline.msg;

    div.appendChild(h1);
    div.appendChild(p);

    container.appendChild(div);
    
  } else {
    const div = document.createElement("div");
    div.classList.add("error");
    div.textContent = "Enter a valid city and country";
    container.appendChild(div);
    
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