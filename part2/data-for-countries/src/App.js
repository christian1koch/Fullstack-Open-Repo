import { useState, useEffect } from "react";
import * as React from "react";
import axios from "axios";

// Filter Component
const SearchBar = ({ inputText, onInputChange }) => (
  <>
    find Countries:{" "}
    <input
      value={inputText}
      onChange={onInputChange}
    />
  </>
);

// Show Temperature Component
const Temperature = ({ city, temperature, image, windSpeed }) => {
  const src = `http://openweathermap.org/img/wn/${image}@2x.png`
  return (
    <>
      <h1>Weather in {city}</h1>
      <p>Temperature: {temperature}</p>
      <img src={src} alt={`weather in ${city}`}/>
      <p>wind {windSpeed} m/s</p>
    </>
  );
};
// Show Countries Component
const MultipleCountriesList = ({
  countriesArray,
  newCountry,
  currentCountryInformation,
  onShowCountryInformation,
  onMatchFound,
  weatherInfo
}) => {
  newCountry = newCountry.toLowerCase().trim();
  const matchingCountries = countriesArray.filter((country) => {
    return country.name.common.toLowerCase().includes(newCountry);
  });

  useEffect(() => {
    if (matchingCountries.length === 1) {
      onMatchFound(matchingCountries[0]);
    }
  }, [matchingCountries, onMatchFound, currentCountryInformation]);

  if (newCountry === "") {
    return;
  }
  if (matchingCountries.length >= 10) {
    return <p>too many matches, specify another filter</p>;
  } else if (currentCountryInformation && weatherInfo) {
    console.log(weatherInfo);
    return <CountryInformation country={currentCountryInformation} weatherInfo={weatherInfo} />;
  } else {
    return (
      <>
        {matchingCountries.map((country) => {
          console.log(country.cca3);
          console.log(country.name.official);
          return (
            <React.Fragment key={"Fragment: " + country.cca3}>
              <p key={"p: " + country.country}>{country.name.common}</p>
              <button
                key={"button: " + country.name.official}
                value={country.name.official}
                onClick={onShowCountryInformation}
              >
                Show
              </button>
            </React.Fragment>
          );
        })}
      </>
    );
  }
};
// Show One Country Component
const CountryInformation = ({ country, weatherInfo }) => (
  <>
    <h1>{country.name.common}</h1>
    <p>capital: {country.capital}</p>
    <p>area: {country.area}</p>
    {"\n"}
    <h2>languages</h2>
    {Object.entries(country.languages).map((language) => {
      return <li key={language[0]}>{language[1]}</li>;
    })}
    <img
      src={country.flags.png}
      alt={country.name.common + " flag"}
    />
      <Temperature city={weatherInfo.city[0]} temperature={weatherInfo.main.temp} image={weatherInfo.weather[0].icon} windSpeed={weatherInfo.wind.speed}/>
  </>
);
const App = () => {
  // states
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [currentCountryInformation, setCurrentCountryInformation] =
    useState("");
  const [currentWeatherInformation, setCurrentWeatherInformation] = useState(
    ""
  );
  // data fetching
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);
  useEffect(() => {
    if (currentCountryInformation !== "") {
      const geoLocationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCountryInformation.capital}," ",${currentCountryInformation.name.common}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      axios.get(geoLocationURL).then((response) => {
        const latLon = { lat: response.data[0].lat, lon: response.data[0].lon };
        const getWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latLon.lat}&lon=${latLon.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`;
        axios.get(getWeatherURL).then((response) => {
          response.data.city=currentCountryInformation.capital
          console.log(response.data);
          setCurrentWeatherInformation(response.data);
        });
      });
    }
  }, [currentCountryInformation]);
  // functions
  const onInputChangeCountry = (event) => {
    setNewCountry(event.target.value);
    setCurrentCountryInformation("");
  };
  const onHandleShow = (event) => {
    const countryInfo = countries.find((country) => {
      return country.name.official === event.target.value;
    });
    setCurrentCountryInformation(countryInfo);
  };
  const onMatchFound = (newCountry) => {
    const countryInfo = countries.find((country) => {
      return country.name.official === newCountry.name.official;
    });
    setCurrentCountryInformation(countryInfo);
  };
  return (
    <>
      <SearchBar
        inputText={newCountry}
        onInputChange={onInputChangeCountry}
      />
      <MultipleCountriesList
        countriesArray={countries}
        newCountry={newCountry}
        currentCountryInformation={currentCountryInformation}
        onShowCountryInformation={onHandleShow}
        onMatchFound={onMatchFound}
        weatherInfo={currentWeatherInformation}
      />
    </>
  );
};

export default App;
