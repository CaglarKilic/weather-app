(() => {
  const base = new URL(process.env.BASE_URL);
  const curr = new URL(process.env.CURRENT_URL, base);
  curr.searchParams.append("key", process.env.WEATHER_API_KEY);

  async function getCurrentWeather(query) {
    curr.searchParams.set("q", query);
    const response = await fetch(curr);
    const data = await response.json();
    return data;
  }

  function displayCurrentData(data) {
    
  }

})();
