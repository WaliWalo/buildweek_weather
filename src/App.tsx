import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import useCustomSelector from "./store/helpers/useCustomSelector";
// import { apiCall } from "./store/api";
// import { weatherCallBody } from "./store/weatherCallReducer";
import { Route } from "react-router-dom";
import Home from "./components/home/Home";
import SelectCity from "./components/selectCity/SelectCity";
import Search from "./components/search/Search";
import { fetchWeather, getCoordinates } from "./api/weatherApi";
import { ICities, IPosition, IWeather } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouteComponentProps } from "react-router-dom";
import "./App.css";

function App(props: RouteComponentProps) {
  // const dispatch = useDispatch();
  // const state = useCustomSelector((store) => store);
  // const handleRedux = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   dispatch(apiCall(weatherCallBody));
  // };
  const [weather, setWeather] = useState<IWeather | null>(null);
  const [position, setPosition] = useState<IPosition | null>(null);
  const [input, setInput] = useState("");
  const [cities, setCities] = useState<ICities | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (position) {
      console.log(position);
      getWeather(position.lat, position.lng);
    }
  }, [position]);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position: GeolocationPosition) {
    setPosition({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }

  function showError(error: GeolocationPositionError) {
    switch (error.code) {
      case 1:
        alert("User denied the request for Geolocation.");
        break;
      case 2:
        alert("Location information is unavailable.");
        break;
      case 3:
        alert("The request to get user location timed out.");
        break;
      default:
        alert("An unknown error occurred.");
        break;
    }
  }

  const getWeather = async (lat: number, lon: number) => {
    const res = await fetchWeather(lat, lon);
    if (res !== undefined) {
      if (res.ok) {
        const data = await res.json();
        if (input === "") {
          setWeather({ ...data, name: "Current Location" });
        } else {
          setWeather({ ...data, name: input });
          setInput("");
        }

        const newData = { ...data, name: "Current Location" };
        setCities({ cities: [newData] });
        if (cities) {
          const newData = { ...data, name: input };
          const newCities = { cities: cities.cities.concat(newData) };
          setCities(newCities);
          setInput("");
        }
      } else {
        alert(`${res.status}: ${res.statusText}`);
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getLatLang();
    props.history.push("/");
  };

  const handleSelectCity = (city: IWeather) => {
    console.log(city);
    setWeather(city);
    props.history.push("/");
  };

  const getLatLang = async () => {
    const res = await getCoordinates(input);
    if (res !== undefined) {
      if (res.ok) {
        const data = await res.json();
        if (data.results.length > 0) {
          const lat = data.results[0].geometry.lat;
          const lang = data.results[0].geometry.lng;
          setPosition({ lat: lat, lng: lang });
          getWeather(lat, lang);
        } else {
          alert("No location found");
        }
      } else {
        alert(`${res.status}: ${res.statusText}`);
      }
    }
  };

  return (
    <div
      className="homeBackground"
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundImage:
          'url("https://media.giphy.com/media/KzqJsfsd78wLe/giphy.gif")',
        position: "relative",
      }}
    >
      <Route
        path="/"
        exact
        render={(props) => <Home routeProps={props} weather={weather} />}
      />
      <Route
        path="/select"
        exact
        render={(props) => (
          <SelectCity
            routeProps={props}
            cities={cities}
            handleSelectCity={(city: IWeather) => handleSelectCity(city)}
          />
        )}
      />
      <Route
        path="/search"
        exact
        render={(props) => (
          <Search
            handleOnChange={handleOnChange}
            input={input}
            handleSubmit={handleSubmit}
          />
        )}
      />
    </div>
  );
}

export default App;
