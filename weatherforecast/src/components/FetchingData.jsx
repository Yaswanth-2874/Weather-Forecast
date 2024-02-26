import React, { Component } from "react";
import FirstHalf from "./DisplayFunction";
import SecondHalf from "./SecondHalf";
import ErrorState from "./ErrorState";

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
    if (query === "") return `${this.state.lat},${this.state.long}`;
    return `${this.state.query}`;
  };
  UpdateData = () => {
    const q = this.setQuery(this.state.query);
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
    if (this.state.inErrorState) return <ErrorState />;

    this.UpdateData();
    const { information } = this.state;
    if (!information || !this.state.lat || !this.state.long)
      return <div>Loading...</div>;

    const { current, location, forecast } = information;
    if (!current || !location || !forecast) return <div>Loading...</div>;
    const dayWiseData = forecast.forecastday;
    const data = this.extractDayWiseData(dayWiseData);

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
          <FirstHalf
            data={data}
            index={this.state.indexing}
            location={location}
            current={current}
          ></FirstHalf>
          <SecondHalf data={data} func={this.handleButtonClick} />
        </div>
      </>
    );
  }
}

export default FetchingData;
