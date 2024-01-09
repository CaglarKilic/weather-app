/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

import IconMap from "./assets/data/weather_conditions.json";

(() => {
  const base = new URL(process.env.BASE_URL);
  const curr = new URL(process.env.CURRENT_URL, base);
  curr.searchParams.append("key", process.env.WEATHER_API_KEY);
  const timeFormat = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  async function getCurrentWeather(query) {
    curr.searchParams.set("q", query);
    const response = await fetch(curr);
    const data = await response.json();
    return data;
  }

  function formatData(data) {
    const {
      location: { name, region, country, localtime },
      current: {
        condition: { code, text },
        temp_c,
        temp_f,
        feelslike_c,
        feelslike_f,
        humidity,
        // wind_dir,
        wind_kph,
        wind_mph,
        is_day,
      },
    } = data;
    return {
      name,
      region,
      country,
      localtime,
      code,
      text,
      temp_c,
      temp_f,
      feelslike_c,
      feelslike_f,
      humidity,
      // wind_dir,
      wind_kph,
      wind_mph,
      is_day,
    };
  }

  function displayCurrentData(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "localtime") {
        document
          .querySelector(`#${key}`)
          .append(timeFormat.format(new Date(value)));
      } else if (key === "code") {
        const path = `./assets/weather/${data.is_day ? "day" : "night"}/${
          IconMap.find((element) => element.code === value).icon
        }.png`;
        import(/* webpackInclude: /\.png$/ */ `${path}`).then((module) => {
          document.querySelector("#icon").src = module.default;
        });
      } else {
        try {
          document.querySelector(`#${key}`).append(value);
        } catch {
          /* empty */
        }
      }
    });
  }

  const d = formatData(JSON.parse(localStorage.getItem("bostanci")));
  displayCurrentData(d);
})();
