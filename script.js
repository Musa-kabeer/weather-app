'use script';
const degree = document.querySelector('.degree');
const town = document.querySelector('.town');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const pressure = document.querySelector('.pressure');
const form = document.querySelector('form');

const apiKey = 'd5147bf297bfa19950482f4237339268';

degree.textContent = '0ºC';

// FETCH WEATHER DETAILS FROM OPEN WEATHER API USING THE LATITUDE AND LONGITUDE PROVIDED BY updateDOMElements() FUNCTION
async function fetchWeather(lat, lng) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`
  );

  const data = await res.json();

  return data;
}

// FETCH FULL DETAILS ABOUT THE LOCATION (LAT & LNG)
async function reverseGeocoding(lat, lng) {
  const res = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=5&appid=${apiKey}`
  );

  return await res.json();
}

// GET CURRENT LOCATION ON INITIAL RENDER
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;

    await updateDOMElements(latitude, longitude);
  },
  (err) => {
    alert(err);
  }
);

async function searchInputWeather(query) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
  );

  return res.json();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.querySelector('.query').value;

  const data = await searchInputWeather(query);

  if (Object.keys(data).length === 1)
    return alert("Can't find the Country. Do try another one");

  const { latitude, longitude } = data.results[0];

  await updateDOMElements(latitude, longitude);
});

async function updateDOMElements(lat, lng) {
  const weather = await fetchWeather(lat, lng);

  const reverse = await reverseGeocoding(lat, lng);

  degree.textContent = `${Math.round(weather.main.temp - 273)}ºC`;

  town.textContent = `${reverse[0].name} ${
    reverse[0].state ? reverse[0].state : ''
  }, ${reverse[0].country}`;

  humidity.textContent = `${weather.main.humidity}%`;
  wind.textContent = `${weather.wind.deg}mps`;
  pressure.textContent = `${weather.main.pressure}`;
}
