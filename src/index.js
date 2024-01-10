/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import "./style.css";
import IconMap from "./assets/data/weather_conditions.json";

(() => {
  const base = new URL(process.env.BASE_URL);
  const forecast = new URL(process.env.FORECAST_URL, base);
  forecast.searchParams.append("key", process.env.WEATHER_API_KEY);
  const timeFormat = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  async function getForecastWeather(query, days) {
    forecast.searchParams.set("q", query);
    forecast.searchParams.set("days", days);
    const response = await fetch(forecast);
    const data = await response.json();
    return data;
  }

  function filterLocationData(data) {
    const { name, region, country, localtime } = data;
    return { name, region, country, localtime };
  }

  function filterCurrentData(data) {
    const {
      condition: { code, text },
      temp_c,
      temp_f,
      feelslike_c,
      feelslike_f,
      humidity,
      wind_kph,
      wind_mph,
      is_day,
    } = data;

    return {
      code,
      text,
      temp_c,
      temp_f,
      feelslike_c,
      feelslike_f,
      humidity,
      wind_kph,
      wind_mph,
      is_day,
    };
  }

  function filterForecastDayData(data) {
    const {
      date,
      day: {
        avghumidity,
        condition: { code, text },
        daily_chance_of_rain,
        daily_chance_of_snow,
        maxtemp_c,
        maxtemp_f,
        maxwind_kph,
        maxwind_mph,
        mintemp_c,
        mintemp_f,
      },
    } = data;
    return {
      date,
      avghumidity,
      code,
      text,
      daily_chance_of_rain,
      daily_chance_of_snow,
      maxtemp_c,
      maxtemp_f,
      maxwind_kph,
      maxwind_mph,
      mintemp_c,
      mintemp_f,
    };
  }

  function dispayData(data) {
    const location = filterLocationData(data.location);
    document.querySelector("#name").replaceChildren(location.name);
    document
      .querySelector("#region")
      .replaceChildren(`${location.region}, ${location.country}`);
    document
      .querySelector("#localtime")
      .replaceChildren(
        `${timeFormat.format(new Date(location.localtime))} Now`
      );

    const current = filterCurrentData(data.current);
    document.querySelector("#text").replaceChildren(current.text);
    import(
      /* webpackInclude:/\.png$/ */ `./assets/weather/${
        current.is_day ? "day" : "night"
      }/${IconMap.find((element) => element.code === current.code).icon}.png`
    ).then((module) => {
      document.querySelector("#icon").src = module.default;
    });
    document.querySelector("#temp_c").replaceChildren(current.temp_c);
    document.querySelector("#temp_f").replaceChildren(current.temp_f);
    document
      .querySelector("#feelslike_c")
      .replaceChildren(Math.round(current.feelslike_c));
    document
      .querySelector("#feelslike_f")
      .replaceChildren(Math.round(current.feelslike_f));
    document
      .querySelector("#humidity")
      .replaceChildren(Math.round(current.humidity));
    document
      .querySelector("#wind_kph")
      .replaceChildren(Math.round(current.wind_kph));
    document
      .querySelector("#wind_mph")
      .replaceChildren(Math.round(current.wind_mph));

    const days = data.forecast.forecastday;
    for (let index = 0; index < days.length; index += 1) {
      const day = filterForecastDayData(days[index]);
      const li = document.querySelector(`li[data-day="${index}"]`);
      li.querySelector(".day").replaceChildren(
        timeFormat.format(new Date(day.date)).slice(0, 3)
      );
      li.querySelector(".min-temp.celsius").replaceChildren(
        Math.round(day.mintemp_c)
      );
      li.querySelector(".min-temp.fahrenheit").replaceChildren(
        Math.round(day.mintemp_f)
      );
      li.querySelector(".max-temp.celsius").replaceChildren(
        Math.round(day.maxtemp_c)
      );
      li.querySelector(".max-temp.fahrenheit").replaceChildren(
        Math.round(day.maxtemp_f)
      );
      import(
        /* webpackInclude:/\.png$/ */ `./assets/weather/day/${
          IconMap.find((element) => element.code === day.code).icon
        }.png`
      ).then((module) => {
        li.querySelector(".icon").src = module.default;
      });
    }
  }

  function changeUnit(event) {
    if (event.target.id === "fahrenheit") {
      event.target.classList.remove("unselected");
      document
        .querySelectorAll(".celsius")
        .forEach((elem) => elem.classList.add("hidden"));
      document
        .querySelectorAll(".fahrenheit")
        .forEach((elem) => elem.classList.remove("hidden"));
      document.querySelector("#celsius").classList.add("unselected");
      document
        .querySelector("#celsius")
        .addEventListener("click", changeUnit, { once: true });
    } else {
      event.target.classList.remove("unselected");
      document
        .querySelectorAll(".celsius")
        .forEach((elem) => elem.classList.remove("hidden"));
      document
        .querySelectorAll(".fahrenheit")
        .forEach((elem) => elem.classList.add("hidden"));
      document.querySelector("#fahrenheit").classList.add("unselected");
      document
        .querySelector("#fahrenheit")
        .addEventListener("click", changeUnit, { once: true });
    }
  }

  document
    .querySelectorAll(".fahrenheit")
    .forEach((elem) => elem.classList.add("hidden"));

  document
    .querySelector("#fahrenheit")
    .addEventListener("click", changeUnit, { once: true });

  document.querySelector("input").addEventListener("keydown", (event) => {
    const backdrop = document.querySelector(".backdrop");
    if (event.key === "Enter") {
      const query = event.target.value;
      getForecastWeather(query, 7).then((resolve) => {
        dispayData(resolve);
        backdrop.classList.add("hidden");
      });
      backdrop.classList.remove("hidden");
      // eslint-disable-next-line no-param-reassign
      event.target.value = "";
      event.target.blur();
    }
  });

  getForecastWeather("kadikoy, istanbul", 7).then((resolve) =>
    dispayData(resolve)
  );
})();
