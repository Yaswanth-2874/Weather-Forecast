import React from "react";

function DisplayFunction(props) {
  let { data, index, location, current} = props;
  if (!location || !current) return <>Loading</>;

  const { name, region, country } = location;
  let { temp_c, wind_kph, condition, humidity } = current;
  let { text, icon } = condition;

  if (index !== 0) {
    icon = data[index].conditionIcon;
    temp_c = data[index].avgTempC;
    text = data[index].forecastedCondition;
    wind_kph = data[index].maxWindKph
    humidity = data[index].avghum
  }
  return (
    <>
      <div className="icon">
        <img
          src={icon}
          alt="Forecasted Weather Condition"
          height="200px"
          width="200px"
        />
      </div>
      <div className="temperature">
        <span style={{ fontSize: "90px" }}>{temp_c}°C</span>
        <span style={{ fontSize: "50px" }}>{text}</span>
      </div>
      <div className="tempfields">
        Date : {data[index].date}
        <br></br>
        {name}, {region}, {country}
        <br></br>Humidity : {humidity}%<br></br>Wind Speed :{" "}
        {wind_kph}kmph
      </div>
    </>
  );
}

export default DisplayFunction;
