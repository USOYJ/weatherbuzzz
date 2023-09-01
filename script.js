const APIKey = "fa28acdeea8415cd264845ae36e19aab";

const today = moment();
$("#current-date").text(today.format("MMM DD, YYYY"));

const currentWeather = $('#current-weather');
const fiveDayContainer = $('#fiveDay');
const listContainer = $('#searchHistory');
const searchButton = $('#search-button');
const citySearch = $('#city-search');

let searchHistory = [];

function getApi(cityName) {
  $('#current-weather').empty();

  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=imperial`;

  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      currentWeather.html(`
        <h2>${data.name}</h2>
        <p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"></img></p>
        <p>Temp: <span>${data.main.temp}°F</span></p>
        <p>Wind: <span>${data.wind.speed}MPH</span></p>
        <p>Humidity: <span>${data.main.humidity}%</span></p>
      `);
    });
}

function fiveDayForecast(cityName) {
  $('#fiveDay').empty();

  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=imperial`;

  fetch(fiveDayURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const fiveDayArray = data.list;

      for (let i = 2; i < fiveDayArray.length; i += 8) {
        const currentForecastIndex = fiveDayArray[i];
        fiveDayContainer.append(`
          <div class="col-2 border border-secondary m-1 bg-dark text-white">
            <p>${moment(currentForecastIndex.dt_txt).format('MMM DD, YYYY')}</p>
            <p><img src="https://openweathermap.org/img/wn/${currentForecastIndex.weather[0].icon}.png"></img></p>
            <p>Temp: <span>${currentForecastIndex.main.temp}°F</span></p>
            <p>Wind: <span>${currentForecastIndex.wind.speed}MPH</span></p>
            <p>Humidity: <span>${currentForecastIndex.main.humidity}%</span></p>
          </div>
        `);
      }
    });
}

function renderSearchHistory() {
  listContainer.empty();

  searchHistory.forEach(savedCity => {
    const btn = $('<button>')
      .attr('type', 'button')
      .addClass('history-btn')
      .attr('data-search', savedCity)
      .text(savedCity);

    listContainer.append(btn);
  });
}

function addToSearchHistory(search) {
  if (!searchHistory.includes(search)) {
    searchHistory.push(search);
    localStorage.setItem('cities', JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

function searchCitySubmit(city) {
  $('#city-search').val('');
  getApi(city);
  fiveDayForecast(city);
  addToSearchHistory(city);
}

searchButton.on('click', function(event) {
  event.preventDefault();
  const currentCity = citySearch.val();
  searchCitySubmit(currentCity);
});

listContainer.on('click', '.history-btn', function(event) {
  const savedCity = $(this).data('search');
  searchCitySubmit(savedCity);
});

function initialize() {
  const history = localStorage.getItem('cities');
  if (history) {
    searchHistory = JSON.parse(history);
  }
  renderSearchHistory();
}

initialize();