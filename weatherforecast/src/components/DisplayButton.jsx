import React from "react";

function DisplayButton(props) {
  const { data, func, index } = props;
  const date = data[index].date;
  const temp = data[index].avgTempC;
  const icon = data[index].conditionIcon;
  return (
    <button className="day" onClick={() => func(index)}>
      {date} <br></br>
      <img src={icon} alt="Weather Condition" />
      <br></br>
      {temp}°C
    </button>
  );
}

export default DisplayButton;
