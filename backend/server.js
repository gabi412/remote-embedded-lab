const logger = require("morgan");
const cors = require("cors");
const express = require("express");
const path = require("path");
var multer = require("multer");
const cp = require("child_process");
const app = express();

app.use(
  cors({
    //  origin: "http://localhost:3000",
    origin: "http://192.168.0.197:3000",
    credentials: true,
  })
);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

// global variables to send back to the frontend
var compileOutput;
var filePath = "./public/programs-sent";
var currentFile;
var pinsDetected = {};
var isCompiled;

// variables used in j5 library;
const Raspi = require("raspi-io").RaspiIO;
const five = require("johnny-five");
const board = new five.Board({
  io: new Raspi({ enableSerial: false }),
  repl: false,
  debug: false,
});

var expander1 = new five.Expander({
  controller: "MCP23008",
  address: 0x20,
});
var expander2 = new five.Expander({
  controller: "MCP23008",
  address: 0x21,
});

var expander1Pins = {
  PB4: { pin: 0 },
  PB5: { pin: 1 },
  PA3: { pin: 2 },
  PA2: { pin: 3 },
  PA1: { pin: 4 },
  PD6: { pin: 5 },
  PD5: { pin: 6 },
  PD4: { pin: 7 },
};
var expander2Pins = {
  PD3: { pin: 0 },
  PD2: { pin: 1 },
  PD1: { pin: 2 },
  PC7: { pin: 3 },
  PC6: { pin: 4 },
  PC5: { pin: 5 },
  PC4: { pin: 6 },
  PC3: { pin: 7 },
};
var readValues = {
  PD4: "",
  PD5: "",
  PD6: "",
  PA1: "",
  PA2: "",
  PA3: "",
  PD3: "",
  PD2: "",
  PD1: "",
  PC7: "",
  PC6: "",
  PC5: "",
  PC4: "",
  PC3: "",
  PB4: "",
  PB5: "",
};

// storage for file upload
var storage = multer.diskStorage({
  destination: "public/programs-sent",
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s/g, ''));
  },
});

var upload = multer({ storage: storage }).single("file");

app.post("/load-file", (req, res) => {
  try {
    upload(req, res, function (err) {
      if (req.file) {
        currentFile = req.file.filename;
      }
      isCompiled = false;
      currentFile = currentFile.replace(/\s/g, '');
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send(req.file);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/code", (req, res) => {
  var codeSent = JSON.stringify(req.body.codeSent);
  var fileName = "main.c";
  var binaryFile = "main.ihx";
  var errorCompile;

  pinsDetected = {};

  const result = cp.exec(
    `echo ${codeSent} > ${filePath}/${fileName}`,
    (error, stdout, stderr) => {
      const compile = cp.exec(
        `sdcc -mstm8 ${fileName} --out-fmt-ihx --all-callee-saves --debug --verbose --stack-auto --float-reent --no-peep`,
        {
          cwd: filePath,
        },
        (error, stdout, stderr) => {
          if (error) {
            compileOutput = error.message;
            errorCompile = true;
          } else if (stdout) {
            compileOutput = stdout;
            errorCompile = false;

            //parse code body to detect pins used and set the variable that contains pins states
            code = codeSent.replace(/\s/g, "").toUpperCase();
            var ports = ["A", "B", "C", "D"];
            for (let i = 0; i < ports.length; i++) {
              for (let j = 1; j < 8; j++) {
                // potential output mode
                if (
                  code.includes(`P${ports[i]}_DDR|=1<<${j}`) ||
                  code.includes(`P${ports[i]}_DDR|=(1<<${j})`) ||
                  code.includes(`P${ports[i]}_ODR|=1<<${j}`) ||
                  code.includes(`P${ports[i]}_ODR|=(1<<${j})`) ||
                  code.includes(`P${ports[i]}_ODR&=~(1<<${j})`) ||
                  code.includes(`P${ports[i]}_ODR^=1<<${j}`) ||
                  code.includes(`P${ports[i]}_ODR^=(1<<${j})`)
                ) {
                  pinsDetected[`P${ports[i]}${j}`] = `oP${ports[i]}${j}`;
                }
                // potential input mode
                if (
                  code.includes(`P${ports[i]}_DDR&=~(1<<${j})`) ||
                  code.includes(`P${ports[i]}_IDR>>${j}`)
                ) {
                  pinsDetected[`P${ports[i]}${j}`] = `iP${ports[i]}${j}`;
                }
              }
            }
          } else {
            compileOutput = stderr;
            errorCompile = false;
          }
          res.status(200).send({ output: compileOutput, error: errorCompile });
        }
      );
    }
  );
  currentFile = binaryFile;
  isCompiled = true;
});
app.post("/flash", (req, res) => {
  if (isCompiled === false) {
    pinsDetected = {};
  }
  resetExpandersPins();
  console.log(currentFile);
  const result = cp.exec(
    `./stm8flash -c stlinkv2 -p stm8s103f3 -w ${filePath}/${currentFile}`,
    (error, stdout, stderr) => {
      if (stderr) {
        flashOutput = stderr;
      } else if (error) {
        flashOutput = error.message;
      } else {
        flashOutput = stdout;
      }
      res.status(200).send(JSON.stringify(flashOutput));
      const removeFile = cp.exec(`rm ${filePath}/${currentFile}`);
    }
  );
});

function resetExpandersPins() {
  Object.keys(expander1Pins).forEach(function (expander1Key) {
    var pinExpander1 = expander1Pins[expander1Key].pin;
    expander1.pinMode(pinExpander1, expander1.MODES.INPUT);
    expander1.pullUp(pinExpander1, expander1.HIGH);
  });
  Object.keys(expander2Pins).forEach(function (expander2Key) {
    var pinExpander2 = expander2Pins[expander2Key].pin;
    expander2.pinMode(pinExpander2, expander2.MODES.INPUT);
    expander2.pullUp(pinExpander2, expander2.HIGH);
  });
}

board.on("ready", () => {
  // set expanders pins on input with pull-up
  resetExpandersPins();
  // create digital-read event
  Object.keys(expander1Pins).forEach(function (expander1Key) {
    var pinExpander1 = expander1Pins[expander1Key].pin;
    expander1.digitalRead(pinExpander1, function (value) {
      readValues[expander1Key] = value;
    });
  });
  Object.keys(expander2Pins).forEach(function (expander2Key) {
    var pinExpander2 = expander2Pins[expander2Key].pin;
    expander2.digitalRead(pinExpander2, function (value) {
      readValues[expander2Key] = value;
    });
  });
});

app.post("/config", (req, res) => {
  var config = req.body.pins;
  for (let i = 0; i < config.length; i++) {
    configOption = config[i].state.substr(0, 1);
    stmKey = config[i].pinName;
    selected = config[i].selected;
    writeVal = parseInt(config[i].writeVal.substr(0, 1));
    Object.keys(expander1Pins).forEach(function (expander1Key) {
      var pinExpander1 = expander1Pins[expander1Key].pin;
      //    var configOption = configData[expander1Key].substr(0, 1);
      if (expander1Key === stmKey) {
        if (selected === true) {
          if (configOption === "i") {
            readValues[expander1Key] = " ";
            expander1.pinMode(pinExpander1, expander1.MODES.OUTPUT);
            expander1.digitalWrite(pinExpander1, parseInt(writeVal));
          } else {
            expander1.pinMode(pinExpander1, expander1.MODES.INPUT);
            expander1.pullUp(pinExpander1, expander1.HIGH);
          }
        }
      }
    });

    Object.keys(expander2Pins).forEach(function (expander2Key) {
      var pinExpander2 = expander2Pins[expander2Key].pin;
      if (expander2Key === stmKey) {
        if (selected === true) {
          if (configOption === "i") {
            readValues[expander2Key] = " ";
            expander2.pinMode(pinExpander2, expander2.MODES.OUTPUT);
            expander2.digitalWrite(pinExpander2, parseInt(writeVal));
          } else {
            expander2.pinMode(pinExpander2, expander2.MODES.INPUT);
            expander2.pullUp(pinExpander2, expander2.HIGH);
          }
        }
      }
    });
  }
  res.status(200).send(JSON.stringify(config));
});

app.get("/get-values", (req, res) => {
  res.status(200).send(JSON.stringify(readValues));
});
app.get("/pins-detected", (req, res) => {
  res.status(200).send({ pinsDetected: pinsDetected });
});

const host = "192.168.0.197";
const port = 8082;
app.listen(port);

console.log(`Server running at ${host}:${port}`);
