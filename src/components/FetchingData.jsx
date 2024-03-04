import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import FirstHalf from "./DisplayFunction";
import SecondHalf from "./SecondHalf";
import ErrorState from "./ErrorState";

const FetchingData = () => {
  const [inErrorState, setInErrorState] = useState(false);
  const [information, setInformation] = useState();
  const [query, setQuery] = useState("");
  const [userChoice, setUserChoice] = useState("");
  const [indexing, setIndexing] = useState(0);

  const UpdateData = () => {
    const currentWeather = `https://api.weatherapi.com/v1/forecast.json?key=29a3ca58cd254f07866142055242202&q=${query}&days=6`;
    fetch(currentWeather)
      .then((data) => {
        if (!data.ok) {
          throw new Error();
        }
        setInErrorState(false);
        return data.json();
      })
      .then((formattedData) => {
        setInformation(formattedData);
      })
      .catch(() => {
        setInErrorState(true);
      });
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    query && UpdateData();
  }, [query]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((values) => {
        setQuery(`${values.latitude},${values.longitude}`);
      })
      .catch((error) => {
        console.log(error);
        setInErrorState(true);
      });
  }, []);

  const updateLocation = (e) => {
    setUserChoice(e.target.value);
  };
  const onSubmitted = (event) => {
    setQuery(userChoice);
    event.preventDefault();
  };
  const handleButtonClick = (index) => {
    setIndexing(index);
  };
  const extractDayWiseData = (dayWiseData) => {
    const data = [];

    dayWiseData.forEach((day, index) => {
      const avgTempC = day.day.avgtemp_c;
      const conditionIcon = day.day.condition.icon;
      const forecastedCondition = day.day.condition.text;
      const date = day.date;
      const maxWindKph = day.day.maxwind_kph;
      const avghum = day.day.avghumidity;
      data.push({
        index: index,
        date,
        avgTempC,
        maxWindKph,
        conditionIcon,
        forecastedCondition,
        avghum,
      });
    });
    return data;
  };
  if (inErrorState) return <ErrorState />;
  if (!information || !query) return <div>Loading...</div>;
  const { current, location, forecast } = information;
  if (!current || !location || !forecast) return <div>Loading...</div>;
  const dayWiseData = forecast.forecastday;
  const data = extractDayWiseData(dayWiseData);

  return (
    <>
      <div className="searchbar">
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              margin: "10px",
            }}
          >
            Weather Data
          </h1>
        </div>
        <div>
          <input type="text" value={userChoice} onChange={updateLocation} />
          <button type="submit" onClick={onSubmitted}>
            Search
          </button>
        </div>
      </div>
      <div className="box">
        <FirstHalf
          data={data}
          index={indexing}
          location={location}
          current={current}
        ></FirstHalf>
        <SecondHalf data={data} func={handleButtonClick} />
      </div>
    </>
  );
};

export default FetchingData;
