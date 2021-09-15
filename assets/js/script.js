var apiKey = 'a935275ed7fe36ed15982f80d3c1c3f1'
var searchForm = document.querySelector('#search-form');
var weatherEl = document.querySelector('#show-weather-element')
var citySearchHistory = [];
var submitButton = document.querySelector('#submit-button')
var citySearchVal = ''
var buttonContainer = document.querySelector('#button-container')
var cityButtons = document.querySelector('#past-city-button')
var appendCityButtons = document.querySelector('#append-city-button')
var todayWeatherCard = document.querySelector('.today-weather-card')


function handleSearchFormSubmit(event) {
    event.preventDefault();


    citySearchVal = document.querySelector('#search-input').value;

    if (!citySearchVal) {
        console.error('You need to search for a city')
        return;
    }

    var queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + citySearchVal + '&appid=' + apiKey;


    fetchApi(queryUrl);
    saveCityChoice(citySearchVal);
    clearInputField();
    createPreviouslySearchedCityButton()
}


function clearInputField() {

    document.getElementById('search-input').value = "";

}

//API is being fetched and passed to  printResults function
function fetchApi(queryUrl) {

   

    todayWeatherBody.innerHTML = "";
    todayWeatherCard.innerHTML = "";
    weatherList.innerHTML = "";

    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            

            var cityLat = data.coord.lat
            var cityLon = data.coord.lon
            fetchExtendedWeatherForecastApi(cityLat, cityLon)
            printTodayWeatherResults(data)
            console.log(data)
        })

}

function fetchExtendedWeatherForecastApi(cityLat, cityLon) {

    var queryUrlApi2 = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + apiKey


    fetch(queryUrlApi2)
        .then(function (response) {
            return response.json();
        })
        .then(function (data2) {
            
            printExtendedWeatherResults(data2)
            console.log(data2)
        })


}



todayWeatherCard = document.createElement('div');
todayWeatherCard.classList.add('card')
todayWeatherCard.classList.add('today-weather-card')
var todayWeatherBody = document.createElement('div')
todayWeatherBody.classList.add('card-body', 'my-style')
var weatherList = document.createElement('ul')

//data from api is successfully being passed to this function
//can't get icon to work
function printTodayWeatherResults(data) {





    
  
    

    var todayWeatherHeader = document.createElement('h3')
    todayWeatherHeader.textContent = 'Todays weather for the city of ' + data.name + ":"

    

    //Today Weather Icon - Can't get icon to render
    var todayWeatherIcon = document.createElement('span');
    var todayWeatherIconVal = data.weather[0].icon
    var weatherIconUrl = '<img src=http://openweathermap.org/img/wn/' + todayWeatherIconVal + '@2x.png ></img>'
    todayWeatherIcon.innerHTML = (weatherIconUrl)

    //Current Temperature. Need to round
    var currentTemperature = document.createElement('li');
    var currentTemperatureVal = Math.round(((data.main.temp - 273.15) * 1.8) + 32)
    currentTemperature.textContent = 'Now: ' + currentTemperatureVal;

    //High Temperature. Need to round
    var todayHighTemperature = document.createElement('li');
    var temperatureHighVal = Math.round(((data.main.temp_max - 273.15) * 1.8) + 32);
    todayHighTemperature.textContent = 'High: ' + temperatureHighVal;

    //Low temperature. Need to Round
    var todayLowTemperature = document.createElement('li');
    var tempartureLowVal = Math.round(((data.main.temp_min - 273.15) * 1.8) + 32);
    todayLowTemperature.textContent = 'Low: ' + tempartureLowVal;

    //Humidity
    var todayHumidity = document.createElement('li');
    var humidityTodayVal = data.main.humidity;
    todayHumidity.textContent = 'Humidity: ' + humidityTodayVal + '%'

    //wind 
    var todayWind = document.createElement('li');
    var todayWindVal = data.wind.speed;
    console.log(todayWindVal)
    todayWind.textContent = 'Wind Speed: ' + todayWindVal;

    todayWeatherCard.append(todayWeatherBody);
    todayWeatherBody.append(todayWeatherHeader, weatherList)
    weatherList.append(todayWeatherIcon, currentTemperature, todayHighTemperature, todayLowTemperature, todayHumidity, todayWind)
    weatherEl.prepend(todayWeatherCard)


}


function printExtendedWeatherResults(data2) {

    var extendedWeatherCard = document.createElement('div')
    extendedWeatherCard.classList.add('card')

    var extendedWeatherMainBody = document.createElement('div')
    extendedWeatherMainBody.classList.add('extened-weather-main-body')

    //uvIndex for today
    var uvIndexToday = document.createElement('span')
    var uvIndexTodayVal = data2.current.uvi;
    console.log(uvIndexTodayVal)
    uvIndexToday.textContent = 'UV Index: ' + uvIndexTodayVal;
    weatherList.append(uvIndexToday)


   //uv class levels applied for css styling
    if (uvIndexTodayVal > 3 && uvIndexTodayVal < 7){
        uvIndexToday.classList.add('moderate-uv')
    } else if (uvIndexTodayVal >= 8) {
        uvIndexToday.classList.add('high-uv')
    } else { uvIndexToday.classList.add('low-uv') }

    console.log(data2)

    for (var i = 0; i < 5; i++) {

        
        var extendedWeatherIconEl = document.createElement('span');
        var extendedWeatherIconVal = data2.daily[i].weather[0].icon
        var extendedWeatherIconUrl = '<img src=http://openweathermap.org/img/wn/' + extendedWeatherIconVal + '@2x.png > </img>'
        extendedWeatherIconEl.innerHTML = (extendedWeatherIconUrl)

        var extendedWeatherHeader = document.createElement('h4');
        var today = new Date();
        var theDayDate = today.getDate() + i

        var date = (today.getMonth() + 1) + '-' + theDayDate + '-' + today.getFullYear();
        extendedWeatherHeader.textContent = date;


        var extendedWeatherBody = document.createElement('div');
        extendedWeatherBody.classList.add('extended-weather-body');
        var extendedWeatherUl = document.createElement('ul');
        extendedWeatherUl.classList.add('extended-weather-ul')


        //High Temp Extended forecast
        var extendedWeatherHighTemp = document.createElement('li')
        var extendedWeatherHighTempVal = Math.round(((data2.daily[i].temp.max - 273.15) * 1.8) + 32);
        extendedWeatherHighTemp.textContent = 'High: ' + extendedWeatherHighTempVal

        //Low Temp Extended Forecast
        var extendedWeatherLowTemp = document.createElement('li')
        var extendedWeatherLowTempVal = Math.round(((data2.daily[i].temp.min - 273.15) * 1.8) + 32);
        extendedWeatherLowTemp.textContent = 'Low: ' + extendedWeatherLowTempVal

        //Humidity
        var extendedWeatherHumidity = document.createElement('li');
        var extendedWeatherHumidityVal = data2.daily[i].humidity;
        extendedWeatherHumidity.textContent = 'Humidity: ' + extendedWeatherHumidityVal + "%";
        
        //wind
        var extendedWeatherWind = document.createElement('li');
        var extendedWeatherWindVal = data2.daily[i].wind_speed;
        console.log(extendedWeatherWindVal)
        extendedWeatherWind.textContent = 'Wind Speed: ' + extendedWeatherWindVal;

      
        
       


        todayWeatherCard.append(extendedWeatherCard)
        extendedWeatherCard.append(extendedWeatherMainBody)
        extendedWeatherMainBody.append(extendedWeatherBody)
        extendedWeatherBody.append(extendedWeatherHeader)
        extendedWeatherHeader.append(extendedWeatherIconEl)
        extendedWeatherBody.append(extendedWeatherUl)
        extendedWeatherUl.append(extendedWeatherHighTemp)
        extendedWeatherHighTemp.append(extendedWeatherLowTemp)
        extendedWeatherLowTemp.append(extendedWeatherHumidity) 
        extendedWeatherHumidity.append(extendedWeatherWind)
    }
}

//How do I get the city to save and not overwrite previous save. I was thinking of using a counter? 
function saveCityChoice(citySearchVal) {
    

    // I need to set up a conditional statement that if citysearch val === to citySearchHistory then do not save to storage.
    citySearchHistory.push(citySearchVal);
    localStorage.setItem("city", JSON.stringify(citySearchHistory));
    
}


function createPreviouslySearchedCityButton() {

    var pastCityButton = document.createElement("button")
    pastCityButton.textContent = citySearchVal
    pastCityButton.classList = "btn btn-primary border";
    pastCityButton.setAttribute("type", "submit")
    pastCityButton.setAttribute("past-city", citySearchVal)
    console.log(pastCityButton)
    buttonContainer.prepend(pastCityButton)
    
}



function handlePastCity (event) { 

   var pastCity = event.target.getAttribute('past-city');
   console.log(pastCity)

    var queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + pastCity + '&appid=' + apiKey;
    fetchApi(queryUrl)
}





searchForm.addEventListener('submit', handleSearchFormSubmit)
buttonContainer.addEventListener('click', handlePastCity)

