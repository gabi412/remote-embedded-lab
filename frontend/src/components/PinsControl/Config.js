import React from "react";
import WriteValue from "./WriteValue";
import ReadValue from "./ReadValue";
import photo from "./stm8blue-pinout.png";
import axios from "axios";
class Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pins: this.props.pins,
    };
    this.handleInOutChange = this.handleInOutChange.bind(this);
    this.sendInOutChanges = this.sendInOutChanges.bind(this);
    this.getPins = this.getPins.bind(this);
  }

  getPins(pins) {
    this.setState({ pins: pins });
  }

  handleInOutChange(event) {

    var pins = event.target.value;
    var temp = this.state.pins;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].pinName === pins.substr(1, 3)) {
        temp[i].state = pins;
        console.log(temp[i].pinName);
      }
    }
    this.setState({ pins: temp });
  }

  sendInOutChanges() {
    axios
      .post("http://192.168.0.197:8082/config", { pins: this.state.pins })
      .then((data) => {
        //     console.log(data);
      })
      .catch((error) => {
        console.error("Post /config err:", error);
      });
  }

  render() {
    return (
      <div>
        <div id="stm8-schema">
          <br />
          <label className="text-title">STM8 pinout</label>
          <br />
          <img className="stm8schema-image" src={photo} alt="STM8 pinout"></img>
          <ul className="left-configuration-list">
            {this.state.pins.map((pin, index) => {
              if (index < 6) {
                return (
                  <li key={pin.pinName}>
                    <select
                      disabled={pin.selected ? false : true}
                      value={pin.state}
                      className={
                        pin.pinName === "PD6"
                          ? "dropdown-pd6-class"
                          : pin.pinName === "PA2"
                          ? "dropdown-pa2-class"
                          : "dropdown-class"
                      }
                      name="configuration"
                      onChange={this.handleInOutChange}
                    >
                      <option id="1" value={`o${pin.pinName}`}>
                        Output {pin.pinName}
                      </option>
                      <option id="0" value={`i${pin.pinName}`}>
                        Input {pin.pinName}
                      </option>
                    </select>
                  </li>
                );
              } else {
                return "";
              }
            })}
          </ul>
          <ul className="right-configuration-list">
            {this.state.pins.map((pin, index) => {
              if (index >= 6) {
                return (
                  <li key={pin.pinName}>
                    <select
                      disabled={pin.selected ? false : true}
                      value={pin.state}
                      className={
                        pin.pinName === "PD6"
                          ? "dropdown-pd6-class"
                          : pin.pinName === "PA2"
                          ? "dropdown-pa2-class"
                          : "dropdown-class"
                      }
                      name="configuration"
                      onChange={this.handleInOutChange}
                    >
                      <option id="1" value={`o${pin.pinName}`}>
                        Output {pin.pinName}
                      </option>
                      <option id="0" value={`i${pin.pinName}`}>
                        Input {pin.pinName}
                      </option>
                    </select>
                  </li>
                );
              } else {
                return "";
              }
            })}
          </ul>

          <label className="right-text-config">Config</label>

          <WriteValue getPinsCallback={this.getPins} pins={this.state.pins} />
          <ReadValue pins={this.state.pins} />

          <label className="left-text-config">Config</label>

          <button
            type="submit"
            className="button-controlpins"
            id="button-config"
            onClick={this.sendInOutChanges}
          >
            Apply changes
          </button>
        </div>
      </div>
    );
  }
}
export default Config;
