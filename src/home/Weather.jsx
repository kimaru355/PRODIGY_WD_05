import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

function Weather() {
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");

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
    const url = `https://api.weatherapi.com/v1/key=d3ec53b7238e4be58fe224501240203&q=${searchInput}`;
    try {
      const response = await fetch(url);
      console.log(response);
      let weather = await response.json();
      console.log(weather);
    } catch (e) {
      console.log(e);
      return;
    }
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center p-4">
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
            className="w-10 hover:scale-90"
            onClick={fetchWeather}
          />
        </div>
      </div>
    </div>
  );
}

export default Weather;
