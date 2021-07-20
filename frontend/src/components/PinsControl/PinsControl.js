import React from "react";
import Config from "./Config";
import "./PinsControl.css";
import axios from "axios";

class PinsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pins: [
        {
          pinName: "PD4",
          selected: false,
          state: "oPD4",
          readVal: "",
          writeVal: "0PD4",
        },
        {
          pinName: "PD5",
          selected: false,
          state: "oPD5",
          readVal: "",
          writeVal: "0PD5",
        },
        {
          pinName: "PD6",
          selected: false,
          state: "oPD6",
          readVal: "",
          writeVal: "0PD6",
        },
        {
          pinName: "PA1",
          selected: false,
          state: "oPA1",
          readVal: "",
          writeVal: "0PA1",
        },
        {
          pinName: "PA2",
          selected: false,
          state: "oPA2",
          readVal: "",
          writeVal: "0PA2",
        },
        {
          pinName: "PA3",
          selected: false,
          state: "oPA3",
          readVal: "",
          writeVal: "0PA3",
        },
        {
          pinName: "PD3",
          selected: false,
          state: "oPD3",
          readVal: "",
          writeVal: "0PD3",
        },
        {
          pinName: "PD2",
          selected: false,
          state: "oPD2",
          readVal: "",
          writeVal: "0PD2",
        },
        {
          pinName: "PD1",
          selected: false,
          state: "oPD1",
          readVal: "",
          writeVal: "0PD1",
        },
        {
          pinName: "PC7",
          selected: false,
          state: "oPC7",
          readVal: "",
          writeVal: "0PC7",
        },
        {
          pinName: "PC6",
          selected: false,
          state: "oPC6",
          readVal: "",
          writeVal: "0PC6",
        },
        {
          pinName: "PC5",
          selected: false,
          state: "oPC5",
          readVal: "",
          writeVal: "0PC5",
        },
        {
          pinName: "PC4",
          selected: false,
          state: "oPC4",
          readVal: "",
          writeVal: "0PC4",
        },
        {
          pinName: "PC3",
          selected: false,
          state: "oPC3",
          readVal: "",
          writeVal: "0PC3",
        },
        {
          pinName: "PB4",
          selected: false,
          state: "oPB4",
          readVal: "",
          writeVal: "0PB4",
        },
        {
          pinName: "PB5",
          selected: false,
          state: "oPB5",
          readVal: "",
          writeVal: "0PB5",
        },
      ],
    };
  }
  onChange(e) {
    var pin = e.target.value;
    var tempState = this.state.pins;
    for (let i = 0; i < this.state.pins.length; i++) {
      if (this.state.pins[i].pinName === pin) {
        tempState[i].selected = !tempState[i].selected;
      }
    }
    this.setState({ pins: tempState });
  }
  componentDidMount() {
    axios
      .get("http://192.168.0.197:8082/pins-detected")
      .then((res) => {
        const pinsDetected = res.data.pinsDetected;
        var tempState = this.state.pins;
        for (let i = 0; i < tempState.length; i++) {
          Object.keys(pinsDetected).forEach(function (key) {
            if (tempState[i].pinName === key) {
              tempState[i].selected = true;
              tempState[i].state = pinsDetected[key];
            }
          });
        }
        this.setState({
          pins: tempState,
        });
      })
      .catch((err) => {
        console.error("Get /pins-detected err " + err);
      });
  }

  render() {
    return (
      <div>
        <label className="label-description">
          Select pins used in your program:
        </label>
        <br />
        <br />
        <ul className="checkbox-pins">
          {this.state.pins.map(({ pinName, selected }, index) => {
            return (
              <div className="checkbox-div" key={index}>
                <li>
                  <input
                    className="checkbox-square"
                    type="checkbox"
                    checked={selected ? true : false}
                    id={pinName}
                    value={pinName}
                    onChange={(e) => this.onChange(e)}
                  ></input>
                  <label className="checkbox-label" htmlFor={pinName}>
                    {pinName}
                  </label>
                </li>
              </div>
            );
          })}
          <br />
        </ul>
        <div id="flexbox-schema-video-stimulus">
          <div id="video-div-stimulus">
            <br />
            <p className="label-description">Visual output</p>
            <img
              className="video-class"
              src="http://192.168.0.197:8081"
              alt="streaming-video"
            ></img>
          </div>
          <Config pins={this.state.pins} />
        </div>
      </div>
    );
  }
}
export default PinsControl;
