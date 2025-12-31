const input = document.getElementById("cityInput");
const title = document.querySelector("#mid-content h1");
const desc = document.querySelector("#mid-content p");
const page = document.getElementById("page1");

const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const weatherDescEl = document.getElementById("weatherDesc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const weatherIconEl = document.getElementById("weatherIcon");

const feelsLikeEl = document.getElementById("feelsLike");
const pressureEl = document.getElementById("pressure");
const visibilityEl = document.getElementById("visibility");

const apiKey = "b8f030421646c2d74a04681c328a394c";

function setDefaultSideContent() {
    cityNameEl.textContent = "🌍 Enter a city";
    weatherIconEl.textContent = "☀️";
    tempEl.textContent = "--°C";
    weatherDescEl.textContent = "Weather info will appear here";
    humidityEl.textContent = "💧 Humidity: --%";
    windEl.textContent = "💨 Wind: -- m/s";
    sunriseEl.textContent = "🌅 Sunrise: --:--";
    sunsetEl.textContent = "🌇 Sunset: --:--";

    feelsLikeEl.textContent = "--°C";
    pressureEl.textContent = "-- hPa";
    visibilityEl.textContent = "-- km";
}
setDefaultSideContent();


input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = input.value.trim();
        if (city) {
            getWeather(city);
            input.value = "";
        }
    }
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("City not found 😢");
                return;
            }
            updateUI(data);
            updateSideContent2(data);
        })
        .catch(() => alert("Something went wrong!"));
}

function updateUI(data) {
    const weather = data.weather[0].main;
    const description = data.weather[0].description;
    const temp = Math.round(data.main.temp);
    const city = data.name;

    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const sunrise = formatTime(data.sys.sunrise);
    const sunset = formatTime(data.sys.sunset);

    title.style.opacity = 0;
    desc.style.opacity = 0;

    setTimeout(() => {
        title.innerHTML = `${temp}°C`;
        desc.innerHTML = `${weather} in ${city}<br>${description}`;
        title.style.opacity = 1;
        desc.style.opacity = 1;
    }, 200);

    cityNameEl.textContent = city;
    tempEl.textContent = `${temp}°C`;
    weatherDescEl.textContent = `${getWeatherEmoji(weather, temp)} ${description}`;
    humidityEl.textContent = `💧 Humidity: ${humidity}%`;
    windEl.textContent = `💨 Wind: ${windSpeed} m/s`;
    sunriseEl.textContent = `🌅 Sunrise: ${sunrise}`;
    sunsetEl.textContent = `🌇 Sunset: ${sunset}`;

    weatherIconEl.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    `;

    changeBackground(weather, description, temp);
}

function updateSideContent2(data) {
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressureEl.textContent = `${data.main.pressure} hPa`;
    visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

function formatTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getWeatherEmoji(weather, temp) {
    if (temp < 0) return "❄️";
    switch (weather) {
        case "Clear": return "☀️";
        case "Clouds": return "☁️";
        case "Rain":
        case "Drizzle": return "🌧️";
        case "Thunderstorm": return "⛈️";
        case "Snow": return "❄️";
        default: return "🌫️";
    }
}

function changeBackground(weather, description, temp) {
    let bgUrl = "";

    if (temp < 0)
        bgUrl = "https://images.pexels.com/photos/53389/iceberg-antarctica-polar-blue-53389.jpeg";
    else if (weather === "Clear")
        bgUrl = "https://images.pexels.com/photos/2042161/pexels-photo-2042161.jpeg";
    else if (weather === "Clouds")
        bgUrl = "https://images.pexels.com/photos/479510/pexels-photo-479510.jpeg";
    else if (weather === "Rain" || weather === "Drizzle")
        bgUrl = "https://images.pexels.com/photos/950223/pexels-photo-950223.jpeg";
    else if (weather === "Thunderstorm")
        bgUrl = "https://images.pexels.com/photos/13032494/pexels-photo-13032494.jpeg";
    else if (weather === "Snow")
        bgUrl = "https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg";
    else
        bgUrl = "https://images.pexels.com/photos/45222/forest-fog-nature-winter-45222.jpeg";

    page.style.transition = "background-image 1s ease-in-out";
    page.style.backgroundImage = `url(${bgUrl})`;
}
