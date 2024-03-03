import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

function Weather() {
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);

  const options = {
    method: "GET",
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?title=${searchInput}`,
    headers: {
      "X-RapidAPI-Key": "1b4a9e954cmsh43969e215f47620p1569d9jsndc42f6fe522c",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  useEffect(() => {
    const inputArea = inputRef.current;
    inputArea.addEventListener("focusin", () => {
      searchContainerRef.current.classList.remove("bg-gray-300");
      searchContainerRef.current.classList.add("bg-gray-400");
    });
    inputArea.addEventListener("focusout", () => {
      searchContainerRef.current.classList.remove("bg-gray-400");
      searchContainerRef.current.classList.add("bg-gray-300");
    });
  }, []);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  async function fetchCities() {
    try {
      const response = await axios.request(options);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchWeather() {
    if (searchInput.length > 2) {
      const url = `https://api.weatherapi.com/v1/current.json?key=d3ec53b7238e4be58fe224501240203&q=${searchInput}`;
      try {
        const response = await fetch(url);
        let weather = await response.json();
        setWeather(weather);
        console.log(weather);
      } catch (e) {
        console.log(e);
        return;
      }
    }
  }

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center p-4">
        <div
          className="w-2/3 max-w-3xl h-12 px-4 flex bg-gray-300 outline-white rounded-full"
          ref={searchContainerRef}
        >
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search city or zip code"
            autoComplete="off"
            ref={inputRef}
            onChange={handleInputChange}
            className="w-full h-full pl-4 outline-none rounded-full bg-gray-300 focus:bg-gray-400 placeholder:text-gray-600 focus:placeholder:text-white text-white text-xl"
          />
          <MagnifyingGlassIcon
            className="w-10 hover:scale-90 active:scale-110"
            onClick={fetchWeather}
          />
        </div>
        <div className="w-5/6 max-w-4xl">
          {weather && (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl pt-2 pb-4">
                Current weather in
                <span className="font-bold"> {weather.location.name}, </span>
                {weather.location.country}
              </h2>
              <div className="grid grid-cols-2 gap-4 bg-blue-2 w-full p-4 rounded-lg">
                <div className="flex flex-col justify-center">
                  <div className="flex">
                    <img
                      src="/thermometer.svg"
                      alt="thermometer icon"
                      className="w-6"
                    />
                    <p className="text-lg">Temperature</p>
                  </div>
                  <p className="text-6xl text-orange-600">
                    {weather.current.feelslike_c}
                    <sup>o</sup>
                  </p>
                </div>
                <p>Test</p>
                <div>
                  <div className="flex">
                    <img
                      src="/humidity.svg"
                      alt="humidity icon"
                      className="w-6"
                    />
                    <p className="text-lg">Humidity</p>
                  </div>
                  <p className="text-6xl text-blue-600">
                    {weather.current.humidity}
                    <sup>o</sup>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/uv.svg" alt="uv icon" className="w-6" />
                    <p className="text-lg">UV</p>
                  </div>
                  <p className="text-6xl text-blue-600">
                    {weather.current.uv}
                    <span className="text-4xl"> of 11</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/wind.svg" alt="wind icon" className="w-6" />
                    <p className="text-lg">Wind</p>
                  </div>
                  <p className="text-6xl text-gray-600">
                    {weather.current.wind_kph}
                    <span className="text-4xl">km/h</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/gust.svg" alt="gust icon" className="w-6" />
                    <p className="text-lg ml-1">Gust</p>
                    <img
                      src="/compass.svg"
                      alt="compass icon"
                      className="w-6 ml-4"
                    />
                    <p className="text-lg">{weather.current.wind_dir}</p>
                  </div>
                  <p className="text-6xl text-gray-600">
                    {weather.current.gust_kph}
                    <span className="text-4xl">km/h</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/uv.svg" alt="uv icon" className="w-6" />
                    <p className="text-lg">UV</p>
                  </div>
                  <p className="text-6xl text-yellow-600">
                    {weather.current.uv}
                    <span className="text-4xl"> of 11</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/visibility.svg" alt="uv icon" className="w-6" />
                    <p className="text-lg">Visibility</p>
                  </div>
                  <p className="text-6xl text-black">
                    {weather.current.vis_km}
                    <span className="text-4xl">km</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;
