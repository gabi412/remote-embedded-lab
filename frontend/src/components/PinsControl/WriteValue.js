import React from "react";

class WriteValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      writeValue: this.props.pins,
    };
    this.handleWriteValChange = this.handleWriteValChange.bind(this);
  }

  handleWriteValChange(event) {
 
    this.props.getPinsCallback(this.state.writeValue);
    var pinName = event.target.value;
    var temp = this.state.writeValue;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].pinName === pinName.substr(1, 3)) {
        temp[i].writeVal = pinName;
      }
    }
    this.setState({ writeValue: temp });
  //  console.log(this.state.writeValue);
  }

  render() {
    return (
      <div>
        <label className="left-text-write">Write</label>
        <ul className="left-write-value-list">
          {this.state.writeValue.map(({ pinName, selected, writeVal, state }, index) => {
            if (index < 6) {
              return (
                <li key={index}>
                  <select
                    className={
                      pinName === "PD6"
                        ? "dropdownpd6-write-class"
                        : pinName === "PA2"
                        ? "dropdownpa2-write-class"
                        : "dropdown-class"
                    }
                    name="configuration"
                    disabled={state[0] === "o" ? true : selected === false ? true : false}
                    onChange={this.handleWriteValChange}
                  >
                    <option id="0" value={`0${pinName}`}>
                      0
                    </option>
                    <option id="1" value={`1${pinName}`}>
                      1
                    </option>
                  </select>
                </li>
              );
            } else {
              return "";
            }
          })}
        </ul>
        <label className="right-text-write">Write</label>
        <ul className="right-write-value-list">
          {this.state.writeValue.map(({ pinName, selected, state }, index) => {
            if (index >= 6) {
              return (
                <li key={index}>
                  <select
                    className="dropdown-write-class"
                    name="configuration"
                    disabled={state[0] === "o" ? true : selected === false ? true : false}
                    onChange={this.handleWriteValChange}
                  >
                    <option id="0" value={`0${pinName}`}>
                      0
                    </option>
                    <option id="1" value={`1${pinName}`}>
                      1
                    </option>
                  </select>
                </li>
              );
            } else {
              return "";
            }
          })}
        </ul>
      </div>
    );
  }
}
export default WriteValue;
