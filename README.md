## Installation

Run `npm install`

## Development server starting up

Run `ng s -o` for a dev server and your default browser will open new window at `http://localhost:4200/`

## Building production code base

Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory.


## App explanation

The demo app is utilizing Angular 11 and Angular Material for styling.
The demo app has three pages: landing / welcome page and two additional pages, demoing Chart.js graphs as line and bar charts.
  ### `welcome` page
  Landing page requires user to enter first and last name. Once user enters first and last name page utilizes RegisterUser service, which uses rxjs to serve current user to other components.
  ### `chart-js-line` and `chart-js-bar`
  Both of the pages demoing the same information consumed from static source './assets/json/cases.json' which suppose to mimic API call to a backend server

The application content for the pages above is projected within `NAVBAR` component



