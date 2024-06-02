import { useState, useEffect } from 'react';
import axios from 'axios';

//naytettavan maan nimi ja show painike
const Country = ({ country, filteredCountries, setFilteredCountries }) => {
  return (
    <div>
      {country.name.common}
      <button
        onClick={() =>
          setFilteredCountries(
            filteredCountries.filter(
              (x) => x.name.common === country.name.common
            )
          )
        }
      >
        show
      </button>
    </div>
  );
};

//naytettavat maat
const Countries = ({ filteredCountries, setFilteredCountries }) => {
  //jos loytyy vain yksi maa naytetaan maan tiedot
  if (filteredCountries.length === 1) {
    const imgStyle = {
      width: '150px',
      border: '1px solid #ddd',
    };
    const [temp, setTemp] = useState(0);
    const [wind, setWind] = useState('');
    const [icon, setIcon] = useState('');
    const api_key = import.meta.env.VITE_API_KEY;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0].capital}&appid=${api_key}`
      )
      .then((response) => {
        setTemp(response.data.main.temp - 272.15);
        setWind(response.data.wind.speed);
        setIcon(response.data.weather[0].icon);
      });

    return (
      <div>
        <h1>{filteredCountries[0].name.common}</h1>
        <div>capital: {filteredCountries[0].capital}</div>
        <div>area: {filteredCountries[0].area}</div>
        <p>
          <b>languages: </b>
        </p>
        <ul>
          {Object.keys(filteredCountries[0].languages).map((key, index) => (
            <li key={index}>{filteredCountries[0].languages[key]}</li>
          ))}
        </ul>
        <img src={filteredCountries[0].flags.svg} style={imgStyle}></img>
        <h2>Weather in {filteredCountries[0].capital}</h2>
        <div>temperature {temp.toFixed(1)} Celcius</div>
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}></img>
        <div>wind {wind} m/s</div>
      </div>
    );
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <Country
          key={country.idd.suffixes}
          country={country}
          filteredCountries={filteredCountries}
          setFilteredCountries={setFilteredCountries}
        />
      ))}
    </div>
  );
};

const App = () => {
  const [value, setValue] = useState('');
  const [countries, setCountries] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [message, setMessage] = useState('');

  //haetaan muuttujaan countries maitten tiedot
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  //kun etsitaan maata muutetaan samalla "filteredCountries" muuttujaa, joka valitsee mitka maat naytetaan
  const handleChange = (event) => {
    const updateCountry = countries.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );

    if (updateCountry.length > 10) {
      setFilteredCountries([]);
      setMessage('Too many matches, specify another filter');
    } else if (updateCountry.length === 1) {
      setFilteredCountries(updateCountry);
      setMessage('');
    } else if (updateCountry.length > 1 && updateCountry.length < 10) {
      setFilteredCountries(updateCountry);
      setMessage('');
    }

    setValue(event.target.value);
  };

  return (
    <div>
      find countries: <input value={value} onChange={handleChange} />
      <div>{message}</div>
      <Countries
        filteredCountries={filteredCountries}
        setFilteredCountries={setFilteredCountries}
      />
    </div>
  );
};

export default App;
