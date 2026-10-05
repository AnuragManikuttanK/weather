const API_KEY ="f262407d38f231b88b6ec52a8f85a758";

const cityInput =document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const forecast = document.getElementById("forecast");

const favoriteBtn = document.getElementById("favoriteBtn");
const favolist = document.getElementById("favolist");

const loading = document.getElementById("loading");

const lightBtn = document.getElementById("light");
const darkBtn = document.getElementById("dark");

const pressure = document.querySelector(".weather-details div:nth-child(3) strong");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


searchBtn.addEventListener("click",function(){
    const city = cityInput.value.trim();
    if(city===""){
        alert("Please enter a city name");
        return;
    }
    getWeather(city);
});

cityInput.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
        const city= cityInput.value.trim();
        if(city==""){
            alert("Please enter a city name");
            return;
        }
        getWeather(city);
    }
});

async function getWeather(city){
    try{
        loading.style.display="block";
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if(!response.ok){
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeather(data);
       await getForecast(city);
    }catch(error){
        alert(error.message);
    }finally{
        loading.style.display="none";
    }
}

function displayWeather(data){
    cityName.textContent= data.name;

    temperature.textContent= Math.round(data.main.temp)+"°C";

    description.textContent= data.weather[0].description;

    humidity.textContent=data.main.humidity+"%";


    const windSpeed = (data.wind.speed*3.6).toFixed(1);

    wind.textContent = windSpeed+" km/h";

    pressure.textContent = data.main.pressure+" hPa";


    const weather = data.weather[0].main;

    if(weather==="Clear"){
        weatherIcon.textContent="☀️";
    }else if(weather==="Clouds"){
        weatherIcon.textContent="☁️";
    }else if(weather ==="Rain"){
        weatherIcon.textContent="🌧️";
    }else if(weather==="Drizzle"){
        weatherIcon.textContent="🌦️";
    }else if(weather==="Thunderstorm"){
        weatherIcon.textContent="⛈️";
    }else if(weather==="Snow"){
        weatherIcon.textContent="❄️";
    }else if(weather==="Mist" ||
             weather==="Fog"  ||
             weather==="Haze"
    ){
        weatherIcon.textContent="🌫️";
    }else{
        weatherIcon.textContent="🌤️";
    }
}

async function getForecast(city){
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);

        if(!response.ok){
            throw new Error("Forecast not found");
        }
        const data = await response.json();
        displayForecast(data);
    }catch(error){
        alert(error.message);
    }
}

function displayForecast(data){
    forecast.innerHTML="";

    const dailyForecast=data.list.filter(function(item){
        return item.dt_txt.includes("12:00:00");
    });

    dailyForecast.slice(0,5).forEach(function(item){
        const date=new Date(item.dt * 1000);

        const day=date.toLocaleDateString(
            "en-US",{
                weekday:"short"
            }
        );

        const weather =item.weather[0].main;
        let icon="🌤️";
        if(weather==="Clear"){
            icon="☀️";
        }else if(weather==="Clouds"){
            icon="☁️";
        }else if(weather==="Rain"){
            icon = "🌧️";
        } else if (weather === "Drizzle") {
            icon = "🌦️";
        } else if (weather === "Thunderstorm") {
            icon = "⛈️";
        } else if (weather === "Snow") {
            icon = "❄️";
        } else if (weather === "Mist" ||
                   weather === "Fog"  ||
                   weather === "Haze"
        ) {
            icon = "🌫️";
        }


        const card = document.createElement("div");
        
        card.className="forecast-card";

        card.innerHTML=` <h3>${day}</h3>
                         <span>${icon}</span>
                         <p>${Math.round(item.main.temp)}°C</p>`;
        forecast.appendChild(card);
    });
}

favoriteBtn.addEventListener("click",function(){
    const city = cityName.textContent;
    if(city==="Search a City"){
        alert("Please search for a city first");
        return;
    }

    if(favorites.includes(city)){
        alert("City is already in favorites");
        return;
    }

    favorites.push(city);
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
    displayFavorites();

    alert(city+" added to favorites")
});


function displayFavorites(){
    favolist.innerHTML="";

    if(favorites.length===0){
        favolist.innerHTML=`
             <p class="no-favo">
                No favorite cities yet
              </p>`;
        return;
    }

    favorites.forEach(function(city){
        const div=document.createElement("div");
        div.className="favorite-city";

        div.innerHTML=`
              <span>⭐ ${city}</span>
             <div>
                <button class="view-btn">
                    View
                </button>
                <button class="remove-btn">
                    Remove
                </button>
            </div> `;

            const viewBtn = div.querySelector(".view-btn");

            viewBtn.addEventListener(
                "click",function(){
                    cityInput.value=city;
                    getWeather(city);
                    window.scrollTo({
                        top:0,
                        behavior:"smooth"
                    });
                }
            );

            const removeBtn= div.querySelector(".remove-btn");

            removeBtn.addEventListener(
                "click",function(){
                    removeFavorite(city);
                }
            );
            favolist.appendChild(div);
    });
}

function removeFavorite(city){
    favorites= favorites.filter(function(item){
        return item !==city;
    });

    localStorage.setItem(
        "favorites",JSON.stringify(favorites)
    );
    displayFavorites();
}

lightBtn.addEventListener("click",function(){
    document.body.style.filter="brightness(1)";
});

darkBtn.addEventListener("click",function (){
    document.body.style.filter="brightness(0.7)";
});

displayFavorites();
