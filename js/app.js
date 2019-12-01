// WEATHER APP LOGIC

// FETCH THE WEATHER DATA FROM API
function getWeather() {
  let longitude;
  let latitude;

  const container = document.querySelector(".container");
  const loading = document.createElement("img");
  loading.classList.add("loader");
  loading.src = "/images/loading.gif";
  container.appendChild(loading);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;

      const API_KEY = "ebfa28b0defa9d7514fcd7d4bb8031fb";
      const proxy = "https://cors-anywhere.herokuapp.com/";

      fetch(
          `${proxy}https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}`
        )
        .then(res => {
          return res.json();
        })
        .then(data => {
          // console.log(data);
          loading.style.display = 'none';
          displayResults(data);
        })
        .catch(error => console.log("something went wrong", error));
    });
  } else {
    alert('Your device is not geolocation supported. Sorry.')
  }
}

// DISPLAY THE WEATHER RESPONSE
function displayResults(data) {
  const container = document.querySelector(".container");

  if (data.timezone) {
    const timezoneDiv = document.createElement("div");
    timezoneDiv.textContent = `Timezone, ${data.timezone}`;

    const summaryDiv = document.createElement("div");
    summaryDiv.textContent = `${data.currently.summary}`;

    const tempDiv = document.createElement("div");
    tempDiv.textContent = `Temperature, ${((data.currently.temperature - 32) * (5 / 9)).toFixed(1)}°c`;

    const humidityDiv = document.createElement("div");
    humidityDiv.textContent = `Humidity, ${(data.currently.humidity * 100).toFixed(0)}%`;

    container.appendChild(timezoneDiv);
    container.appendChild(summaryDiv);
    container.appendChild(tempDiv);
    container.appendChild(humidityDiv);
  } else if (data.offline) {
    const div = document.createElement('div');
    dispatchEvent.classList.add('offline');

    const h1 = document.createElement("h1");
    h1.textContent = data.offline.title;

    const p = document.createElement("p");
    p.textContent = data.offline.msg;

    div.appendChild(h1);
    div.appendChild(p);

    container.appendChild(div);

  } else {
    const div = document.createElement('div');
    div.classList.add('error');
    div.textContent = "Kindly turn on your location";
    
    container.appendChild(div);
  }
}

// REGISTER THE SERVICEWORKER FOR PWA CAPABILITIES
window.addEventListener("load", () => {
  const container = document.querySelector(".container");
  container.textContent = "";
  getWeather();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(registration => {
        console.log(
          "{serviceWorker} registered"
        );
      })
      .catch(err => {
        console.log("There was an error");
      });
  }
});