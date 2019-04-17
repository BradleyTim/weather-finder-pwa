// WEATHER APP LOGIC

window.addEventListener('load', () => {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(registration => {
      console.log('{serviceWorker} registered');
    })
    .catch(err => {
      console.log('There was an error');
    });
  }
});

const fetchweather = async() => {
  const city = document.querySelector('#city').value;
  const country = document.querySelector('#country').value;
  try {
    const API_KEY ="cf701ba1fa0b6880bd6c1a3d23e41be5";
    const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
  
    const response = await api_call.json();
  
    //console.log(response);
  
    handleDisplay(response);

  } catch(error) {
    console.log(error);
  }

}

const handleDisplay = response => {
  const container = document.querySelector('.container');
  if(response.main) {
    container.innerHTML = `
    <div><span>Temperature:</span> ${response.main.temp} celcius</div>
    <div><span>Humidity:</span> ${response.main.humidity}</div>
    <div><span>Weather:</span> ${response.weather[0].main} </div>
    <div><span>Description:</span> ${response.weather[0].description}</div>
    `;
  } else if(response.offline) {
    container.innerHTML = `
    <div class="offline">
    <h1>${response.offline.title}</h1>
    <p>${response.offline.msg}</p>
    </div>`;
  } else {
    container.innerHTML = `<div class="error">Enter a valid city and country.</div>`;
  }



}

const button = document.querySelector('#search');
button.addEventListener('click', (e) => {
  e.preventDefault();

  fetchweather();
  
});
