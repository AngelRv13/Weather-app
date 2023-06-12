const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true })); 
app.get("/", function (req, res) {////This code defines a route for handling GET requests to the root URL ("/"). When a user accesses the root URL, the server responds by sending the "page.html" file located in the current directory.
  res.sendFile(__dirname + "/page.html");
});

// First Step - Install our packages
// Second Step - Store the packages as variables

app.post('/', (req, res) => { // Here, a route for handling POST requests to the root URL ("/") is defined. When a POST request is received, the server retrieves the cityName and state values from the request body. These values are used to construct a URL for the OpenWeatherMap API to fetch location data.
    const cityName = req.body.cityName; // This is where we request the information from our bodyParser
    const state = req.body.state
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state},US&limit=&appid=4c74aae2cfbec339ce488bea1b9d7d11`
    https.get(url,function(response){
        response.on("data",(data)=>{
        const countryData = JSON.parse(data)[0]
        const lat = countryData.lat
        const lon = countryData.lon
        const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4c74aae2cfbec339ce488bea1b9d7d11&units=imperial`; // Now we're creating a varibale for our url, which will hold our API key
        https.get(url2, (response) => {
            response.on('data', (data) => {
                const jsonData = JSON.parse(data);
                const temp = jsonData.main.temp;
                const des = jsonData.weather[0].description;
                const icon = jsonData.weather[0].icon;
                const imageURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
                console.log(jsonData);
                res.write(`<h1>The temperature in ${cityName} is ${temp}F </h1>`);
                res.write(`<p>The weather is considered ${des}</p>`)
                res.write('<img src = ' + imageURL + '>')
                //Within the callback function of the second API call, another HTTP GET request is made to retrieve weather data from the OpenWeatherMap API. The received data is parsed as JSON, and the temperature (temp), weather description (des), and weather icon (icon) are extracted.
            })
        })
        })
    })
})
app.listen(8000, () =>{
    console.log(`The Server is Working!`)
})