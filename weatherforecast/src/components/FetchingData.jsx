import React, { Component } from "react";

export class FetchingData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: NaN,
      long: NaN,
      userChoice: "",
      information: [],
      inErrorState: false,
      indexing: 0,
      query: "",
    };
  }
  componentDidMount() {
    fetch("https://ipapi.co/json/")
      .then((address) => address.json())
      .then((values) => {
        this.setState({
          lat: values.latitude,
          long: values.longitude,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          inErrorState: true,
        });
      });
  }
  setQuery = (query) => {
    if(query === "") return `${this.state.lat},${this.state.long}`
    return `${this.state.query}`
  }
  UpdateData = () => {
    const q = this.setQuery(this.state.query)
    const currentWeather = `https://api.weatherapi.com/v1/forecast.json?key=29a3ca58cd254f07866142055242202&q=${q}&days=6`;
    fetch(currentWeather)
      .then((data) => {
        if (!data.ok) {
          throw new Error();
        }
        this.setState({
          inErrorState: false,
        });
        return data.json();
      })
      .then((formattedData) => {
        this.setState({
          information: formattedData,
        });
      })
      .catch(() => {
        this.setState({
          inErrorState: true,
        });
      });
  };
  updateLocation = (event) => {
    this.setState({
      userChoice: event.target.value,
    });
  };
  onSubmitted = (event) => {
    this.setState({
      query: this.state.userChoice,
    });
    this.UpdateData();
    event.preventDefault();
  };
  handleButtonClick = (index) => {
    this.setState({
      indexing: index,
    });
  };

  extractDayWiseData = (dayWiseData) => {
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
  render() {
    if (this.state.inErrorState)
      return (
        <>
          <form>
            <input
              type="text"
              value={this.state.userChoice}
              onChange={this.updateLocation}
            />
            <button type="submit" onClick={this.onSubmitted}>
              Submit
            </button>
          </form>
          <h2>
            Connection timed out due to poor internet or bad query. Please try
            again later
          </h2>
        </>
      );

    this.UpdateData();
    const { information } = this.state;
    if (!information || !this.state.lat || !this.state.long)
      return <div>Loading...</div>;
    // console.log(information);
    const { current, location, forecast } = information;

    if (!current || !location || !forecast) return <div>Loading...</div>;
    // console.log(forecast);

    const dayWiseData = forecast.forecastday;
    // console.log(dayWiseData);
    const data = this.extractDayWiseData(dayWiseData);

    // console.log(data);

    const { temp_c, wind_kph, condition, humidity } = current;
    // console.log(air)
    const { text, icon } = condition;
    const { name, region, country } = location;

    const DisplayFunction = (index) => {
      if (index === 0)
        return (
          <>
            <div className="icon">
              <img
                src={icon}
                alt="Current Weather Condition"
                height="200px"
                width="200px"
              />
            </div>
            <div className="temperature">
              <span style={{ fontSize: "90px" }}>{temp_c}°C</span>
              <span style={{ fontSize: "50px" }}>{text}</span>
            </div>
            <div className="tempfields">
              Date : {data[0].date}
              <br></br>
              {name}, {region}, {country}
              <br></br>Humidity : {humidity}%<br></br>Wind Speed : {wind_kph}
              kmph
            </div>
          </>
        );

      return (
        <>
          <div className="icon">
            <img
              src={data[index].conditionIcon}
              alt="Forecasted Weather Condition"
              height="200px"
              width="200px"
            />
          </div>
          <div className="temperature">
            <span style={{ fontSize: "90px" }}>{data[index].avgTempC}°C</span>
            <span style={{ fontSize: "50px" }}>
              {data[index].forecastedCondition}
            </span>
          </div>
          <div className="tempfields">
            Date : {data[index].date}
            <br></br>
            {name}, {region}, {country}
            <br></br>Humidity : {data[index].avghum}%<br></br>Wind Speed :{" "}
            {data[index].maxWindKph}kmph
          </div>
        </>
      );
    };
    return (
      <>
        <div className="searchbar">
          <div>
          <h1 style={{ display: "flex", justifyContent: "space-evenly", margin:"10px"}}>
            Weather Data
          </h1>
          </div>
          <div>
            <input
              type="text"
              value={this.state.userChoice}
              onChange={this.updateLocation}
            />
            <button type="submit" onClick={this.onSubmitted}>
              Search
            </button>
          </div>
          </div>
        <div className="box">
          <div className="firsthalf">
            {DisplayFunction(this.state.indexing)}
          </div>
          <div className="secondhalf">
            <button className="day" onClick={() => this.handleButtonClick(0)}>
              {data[0].date} <br></br>
              <img src={data[0].conditionIcon} alt="Weather Condition" />
              <br></br>
              {data[0].avgTempC}°C
            </button>
            <button className="day" onClick={() => this.handleButtonClick(1)}>
              {data[1].date} <br></br>
              <img src={data[1].conditionIcon} alt="Weather Condition" />
              <br></br>
              {data[1].avgTempC}°C
            </button>
            <button className="day" onClick={() => this.handleButtonClick(2)}>
              {data[2].date} <br></br>
              <img src={data[2].conditionIcon} alt="Weather Condition" />
              <br></br>
              {data[2].avgTempC}°C
            </button>
            <button className="day" onClick={() => this.handleButtonClick(3)}>
              {data[3].date} <br></br>
              <img src={data[3].conditionIcon} alt="Weather Condition" />
              <br></br>
              {data[3].avgTempC}°C
            </button>
            <button className="day" onClick={() => this.handleButtonClick(4)}>
              {data[4].date} <br></br>
              <img src={data[4].conditionIcon} alt="Weather Condition" />
              <br></br>
              {data[4].avgTempC}°C
            </button>
            <button className="day" onClick={() => this.handleButtonClick(5)}>
              {data[5].date} <br></br>
              <img src={data[5].conditionIcon} alt="Weather Condition" />
              <br></br>
              {data[5].avgTempC}°C
            </button>
          </div>
        </div>
        {/* <span style={{position: "relative", left: "100vh", top:"10px"}}>Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a></span> */}
      </>
    );
  }
}

export default FetchingData;
