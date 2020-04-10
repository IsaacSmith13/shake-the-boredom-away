import { REACT_APP_WEATHER_API_KEY } from "./../../private-keys.js";

export async function determineGoodWeather({ zipCode }) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${REACT_APP_WEATHER_API_KEY}`
  );

  let data = await response.json();
  return data.weather[0].main;
}
