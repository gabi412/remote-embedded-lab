# remote-embedded-lab
This project represents an easy method for remote testing of embedded programs on STM8 microcontroller through a webpage

# System design

![alt text](https://i.imgur.com/IogjJGg.jpg)

The app runs locally on a Raspberry Pi 4 Model B to which is connected the microcontroller by ST-Link programmer. In this way the programs sent by the user can be easily loaded into STM8 flash memory. The system provides a video streaming focused on microcontroller to be monitorized by the user. The stream is also hosted on Raspberry Pi using Motion program. It is integrated in both pages. The GPIO pins of STM8 can be read or stimulated (applying a digital value) through GPIO pins of MCP23008 expanders. Each connection between two pins includes a 100 ohm resistor to decrease a potential shortcircuit current.
The following image represents largely the connection of the components. MCP2008 expanders communicate with RPi by I2C protocol. Blue line represents SDA line while SCL is the green one. Red and black wires are VCC and GND which are used also to set addresses of the expanders. The programmer is connected to STM8 through SWIM interface.

![alt text](https://i.imgur.com/9PLJEZF.jpg?1)

## Usage

First page is called Home. Here the user have the possibility either to select and upload a file from his local file system or write and compile the code in a text editor. The code written is compiled by SDCC compiler and the application provides the compiling result back to the user. Once one of this options is done the program can be loaded into STM8 memory by pressing Flash button. After that, the user can interact with the GPIO pins from Pins Control page. Applying a digital value is possible only to input STM8 pins as the appropriate ones on the expanders are configured as output. Reading values can be made on every GPIO pin. This functionallity is represented in the following image.

![alt text](https://i.imgur.com/R20h7xB.png?1)

## Start 

To run the app you need Node.js installed on a Raspberry Pi. The system also uses stm8flash program and SDCC compiler.
HTTP requests are sent to local server running on Raspberry Pi.
To get started you need to run React app from ```frontend``` folder and web server from ```backend``` folder:
  ```  
   npm start
   node server.js
   ```
