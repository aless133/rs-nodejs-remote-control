# RSSchool NodeJS websocket task - Remote Control
* Static http server
* Frontend App
* By default WebSocket client tries to connect to the 8080 port
* Backend 
* Streams is used in modules communication, that was noted by task author as fine.

## Installation
1. Clone repo
2. Switch to `develop` branch
3. `npm install`

## Usage

* Start (see below), open http://localhost:8181 and use application

#### Development

`npm run dev`

* App served @ `http://localhost:8181` with nodemon
* Backend served @ `ws://localhost:8080` with nodemon

#### Production

`npm run start`

* App served @ `http://localhost:8181` without nodemon
* Backend served @ `ws://localhost:8080` without nodemon

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

