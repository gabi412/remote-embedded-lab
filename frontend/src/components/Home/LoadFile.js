import React from "react";
import axios from "axios";

class LoadFile extends React.Component {
  state = {
    selectedFile: null,
    valid: false,
  };

  handleFileChange(event) {
    this.setState({ selectedFile: event.target.files[0] });
  }

  handleFileUpload() {
    //create FormData object, append file and send it to server

    const data = new FormData();
    const extensions = ["ihx", "hex", "ihex"];
    data.append("file", this.state.selectedFile);
    if (this.state.selectedFile != null) {
      var extension = this.state.selectedFile.name.split(".")[1];
      if (!extensions.includes(extension)) {    
	 alert(
             `${this.state.selectedFile.name} is not valid.\nPlease add a .ihx, .hex or .ihex file!`);
      } else {
        axios({
          method: "post",
          url: "http://192.168.0.197:8082/load-file",
          data: data,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            this.setState({ valid: true });
          })
          .catch((err) => {
            console.error("Error on uploading " + err);
            alert("Something went wrong..\nPlease try again.");
            this.setState({ isLoading: false });
          });
      }
    } else {
      alert("Please add a file.");
    }
  }
  handleFileClick() {
    this.setState({ valid: false }); // reset File Uploaded message when selecting another file
  }
  fileData = () => {
    if (this.state.selectedFile && this.state.valid) {
      return (
        <div>
          <h2>File uploaded!</h2>
          <p>Your file: {this.state.selectedFile.name}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose source file then press upload</h4>
        </div>
      );
    }
  };

  render() {
    if (!this.props.isCompiling) {
      return (
        <div>
          <h2>Upload binary file</h2>
          <div>
            <input
              type="file"
              onChange={this.handleFileChange.bind(this)}
              onClick={this.handleFileClick.bind(this)}
              accept=".ihx, .hex, .ihex"
            />
            <br />
            <br />
            <button
              className="button-home"
              onClick={this.handleFileUpload.bind(this)}
            >
              Upload
            </button>
          </div>
          {this.fileData()}
        </div>
      );
    } else {
      return "";
    }
  }
}

export default LoadFile;
