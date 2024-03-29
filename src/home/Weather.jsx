import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRef, useEffect, useState, Suspense } from "react";

function Weather() {
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const notifyRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const inputArea = inputRef.current;
    inputArea.addEventListener("focusin", () => {
      searchContainerRef.current.classList.remove("bg-gray-200");
      searchContainerRef.current.classList.add("bg-gray-400");
      inputRef.current.classList.remove("text-slate-800");
      inputRef.current.classList.add("text-white");
    });
    inputArea.addEventListener("focusout", () => {
      searchContainerRef.current.classList.remove("bg-gray-400");
      searchContainerRef.current.classList.add("bg-gray-200");
      inputRef.current.classList.remove("text-white");
      inputRef.current.classList.add("text-slate-800");
    });
  }, []);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  async function fetchCities() {
    while (notifyRef.current.firstChild) {
      notifyRef.current.removeChild(notifyRef.current.firstChild);
    }
    if (weather == null) {
      notifyRef.current.classList.remove("text-red-400");
    }
    if (searchInput.length > 2) {
      try {
        const url = `https://api.weatherapi.com/v1/search.json?key=d3ec53b7238e4be58fe224501240203&q=${searchInput}`;
        const response = await fetch(url);
        if (response.status === 200) {
          let cities = await response.json();
          if (cities.length > 0) {
            notifyRef.current.classList.remove("hidden");
            notifyRef.current.classList.add("text-black", "flex", "flex-col");
            cities.forEach((city) => {
              let one = document.createElement("button");
              one.classList.add(
                "bg-gray-300",
                "hover:bg-gray-400",
                "w-full",
                "rounded-lg",
                "border",
                "border-gray-800",
                "text-black"
              );
              one.textContent = city.name;
              one.addEventListener("click", () => {
                setSearchInput(city.name);
                inputRef.current.value = city.name;
                fetchWeather();
              });
              notifyRef.current.appendChild(one);
            });
          }
        }
      } catch (e) {
        console.log("Error:", e);
      }
    }
  }

  async function fetchWeather() {
    if (searchInput.length > 2) {
      const url = `https://api.weatherapi.com/v1/current.json?key=d3ec53b7238e4be58fe224501240203&q=${searchInput}`;
      try {
        while (notifyRef.current.firstChild) {
          notifyRef.current.removeChild(notifyRef.current.firstChild);
        }
        inputRef.current.setAttribute("disabled", "");
        searchRef.current.classList.add("scale-110");
        searchRef.current.classList.remove("hover:scale-90");
        searchRef.current.setAttribute("disabled", "");
        notifyRef.current.textContent = "Loading...";
        notifyRef.current.classList.add("text-green-800");
        notifyRef.current.classList.remove("hidden");

        const response = await fetch(url);
        notifyRef.current.classList.remove("text-green-800");
        if (response.status == 200) {
          let weather = await response.json();
          setWeather(weather);
          notifyRef.current.classList.add("hidden");
          notifyRef.current.textContent = "";
          inputRef.current.value = "";
          setSearchInput("");
        } else if (response.status == 400) {
          notifyRef.current.classList.add("text-red-400");
          notifyRef.current.textContent = `${searchInput} does not exist`;
          setWeather(null);
        }
      } catch (e) {
        console.log("Error: ", e.message);
      }

      inputRef.current.removeAttribute("disabled");
      searchRef.current.removeAttribute("disabled");
      searchRef.current.classList.remove("scale-110");
      searchRef.current.classList.add("hover:scale-90");
    }
  }

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center p-4">
        <div
          className="w-2/3 max-w-3xl h-12 px-4 flex bg-gray-200 outline-white rounded-full"
          ref={searchContainerRef}
        >
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search city"
            autoComplete="off"
            ref={inputRef}
            onChange={handleInputChange}
            onKeyUp={fetchCities}
            className="w-full h-full pl-4 outline-none rounded-full bg-gray-200 focus:bg-gray-400 placeholder:text-gray-600 text-slate-800 focus:placeholder:text-white text-xl"
          />
          <MagnifyingGlassIcon
            className="w-10 hover:scale-90"
            onClick={fetchWeather}
            ref={searchRef}
          />
        </div>
        <div className="text-4xl w-2/3 max-w-3xl hidden" ref={notifyRef}></div>
        <div className="w-5/6 min-w-80 max-w-4xl overflow-auto">
          {weather && (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl pt-2 pb-4">
                Current weather in
                <span className="font-bold"> {weather.location.name}, </span>
                {weather.location.country}
              </h2>
              <div className="grid grid-cols-2 place-items-center gap-4 bg-blue-2 w-full p-4 rounded-lg">
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
                <div>
                  <div>
                    <p>{weather.current.condition.text}</p>
                  </div>
                  <Suspense>
                    <img
                      src={weather.current.condition.icon}
                      alt="condition"
                      className="h-full"
                    />
                  </Suspense>
                </div>
                <div>
                  <div className="flex">
                    <img
                      src="/humidity.svg"
                      alt="humidity icon"
                      className="w-6"
                    />
                    <p className="text-lg">Humidity</p>
                  </div>
                  <p className="text-4xl text-blue-600 sm:text-6xl">
                    {weather.current.humidity}
                    <sup>o</sup>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img
                      src="/pressure.svg"
                      alt="pressure icon"
                      className="w-6"
                    />
                    <p className="text-lg">Pressure</p>
                  </div>
                  <p className="text-4xl text-blue-600 sm:text-6xl">
                    {weather.current.pressure_mb}
                    <span className="text-2xl sm:text-4xl">mb</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/wind.svg" alt="wind icon" className="w-6" />
                    <p className="text-lg">Wind</p>
                    <img
                      src="/compass.svg"
                      alt="compass icon"
                      className="w-6 ml-2 sm:ml-4"
                    />
                    <p className="text-lg">{weather.current.wind_dir}</p>
                  </div>
                  <p className="text-4xl sm:text-6xl text-gray-600">
                    {weather.current.wind_kph}
                    <span className="text-2xl">km/h</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/gust.svg" alt="gust icon" className="w-6" />
                    <p className="text-lg ml-1">Gust</p>
                    <img
                      src="/compass.svg"
                      alt="compass icon"
                      className="w-6 ml-2 sm:ml-4"
                    />
                    <p className="text-lg">{weather.current.wind_dir}</p>
                  </div>
                  <p className="text-4xl sm:text-6xl text-gray-600">
                    {weather.current.gust_kph}
                    <span className="text-2xl">km/h</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/uv.svg" alt="uv icon" className="w-6" />
                    <p className="text-lg">UV</p>
                  </div>
                  <p className="text-4xl sm:text-6xl text-yellow-600">
                    {weather.current.uv}
                    <span className="text-4xl"> of 11</span>
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <img src="/visibility.svg" alt="uv icon" className="w-6" />
                    <p className="text-lg">Visibility</p>
                  </div>
                  <p className="text-4xl sm:text-6xl text-black">
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
