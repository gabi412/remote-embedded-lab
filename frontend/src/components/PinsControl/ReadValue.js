import React from "react";
import axios from "axios";

class ReadValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readValue: this.props.pins,
    };
    this.handleSubmitRead = this.handleSubmitRead.bind(this);
  }

  componentDidMount() {
    this.readValues();
  }

  readValues() {
    var temp = this.state.readValue;
    axios
      .get("http://192.168.0.197:8082/get-values")
      .then((res) => {
        const pinValues = res.data;
        Object.keys(pinValues).forEach(function (key) {
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].pinName === key) {
              temp[i].readVal = pinValues[key];
            }
          }
        });
        this.setState({
          readValue: temp,
        });
      })
      .catch((err) => {
        console.error("Get /get-values err:" + err);
      });
  }
  handleSubmitRead(event) {
    event.preventDefault();
    this.readValues();
  }

  render() {
    return (
      <div>
        <label className="right-text-read">Read</label>
        <ul className="left-read-value-list">
          {this.state.readValue.map(({ pinName, readVal }, index) => {
            if (index < 6) {
              return (
                <li key={index}>
                  <input
                    readOnly
                    type="text"
                    className={
                      pinName === "PD6"
                        ? "dropdownpd6-read-box-class"
                        : pinName === "PA2"
                        ? "dropdownpa2-read-box-class"
                        : "read-box"
                    }
                    value={readVal}
                  />
                </li>
              );
            } else {
              return "";
            }
          })}
        </ul>
        <label className="left-text-read">Read</label>
        <ul className="right-read-value-list">
          {this.state.readValue.map(({ pinName, readVal }, index) => {
            if (index >= 6) {
              return (
                <li key={index}>
                  <input
                    readOnly
                    type="text"
                    className="read-box"
                    value={readVal}
                  />
                </li>
              );
            } else {
              return "";
            }
          })}
        </ul>

        <button
          type="submit"
          id="button-read"
          className="button-controlpins"
          onClick={this.handleSubmitRead}
        >
          Read Values
        </button>
      </div>
    );
  }
}
export default ReadValue;
