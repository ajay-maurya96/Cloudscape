
const WEATHER_API_URL = 'https://api.tomorrow.io/v4/weather/realtime';
const API_KEY = 'ujeBAIJqXIadTfNcv7PHN5p9OnQg4uiQ';

const cityForm = document.querySelector('#city-form');
const searchInput = document.querySelector('#search-input');
const loading = document.querySelector('.loading');
const error = document.querySelector(".error");
const weatherElm = document.querySelector('.weather');
const weatherBehaviorElm = document.querySelector("#behavior");
const temperatureElm = document.querySelector("#temp");
const humidityElm = document.querySelector("#humidity");
const windSpeedElm = document.querySelector("#wind-speed");
const cityElement = document.querySelector("#city");

cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = searchInput.value;
    if (!city || city.length === 0) return;
    const url = getRequestUrl(city);
    initializeState();
    const weatherData = await getWeatherData(url);
    if (weatherData) processWeatherData(weatherData);
    toggleLoading();
});

function getRequestUrl(location) {
    const apiUrl = new URL(WEATHER_API_URL);
    apiUrl.searchParams.append('apikey', API_KEY);
    apiUrl.searchParams.append('location', location);
    return apiUrl.href;
}

async function getWeatherData(url) {
    let response;

    try {
        response = await fetch(url);
    }
    catch (e) {
    }

    if (response?.ok) {
        const json = await response.json();
        return json;
    }

    error.hidden = false;
    return null;
}

function toggleLoading() {
    loading.toggleAttribute('hidden');
}

function initializeState() {
    toggleLoading();
    error.hidden = true;
    weatherElm.hidden = true;
}

function processWeatherData(data) {
    const values = data.data.values;
    const weatherCode = values.weatherCode;
    const weatherBehavior = getBehavior(weatherCode);
    const temperature = values.temperature;
    const humidity = values.humidity;
    const windSpeed = values.windSpeed;
    const city = data.location.name;
    weatherElm.hidden = false;
    weatherBehaviorElm.textContent = weatherBehavior;
    temperatureElm.textContent = +temperature;
    humidityElm.textContent = +humidity;
    windSpeedElm.textContent = +windSpeed;
    cityElement.textContent = city;
    cityElement.setAttribute('title', city);
}

function getBehavior(weatherCode) {
    return weatherBehaviors[+weatherCode];
}


const weatherBehaviors = {
    "0": "Unknown",
    "1000": "Clear, Sunny",
    "1100": "Mostly Clear",
    "1101": "Partly Cloudy",
    "1102": "Mostly Cloudy",
    "1001": "Cloudy",
    "2000": "Fog",
    "2100": "Light Fog",
    "4000": "Drizzle",
    "4001": "Rain",
    "4200": "Light Rain",
    "4201": "Heavy Rain",
    "5000": "Snow",
    "5001": "Flurries",
    "5100": "Light Snow",
    "5101": "Heavy Snow",
    "6000": "Freezing Drizzle",
    "6001": "Freezing Rain",
    "6200": "Light Freezing Rain",
    "6201": "Heavy Freezing Rain",
    "7000": "Ice Pellets",
    "7101": "Heavy Ice Pellets",
    "7102": "Light Ice Pellets",
    "8000": "Thunderstorm"
};
