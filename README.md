# OpenOD for xOCAL 

## This is the repository for the OpenOD xOCAL project

This project is structured in two parts: a React app for the frontend, and a Flask app at the backend. 

To install the project, first clone the repository using `git`. Then start the frontend and backend development servers. 

## Frontend
The frontend was created using Create React App (`react scripts`), using `yarn` as the package manager. Below is information from the CRA Documentation on how to run the app. 

Before you run the app, make sure you install all the dependencies! The frontend requires `mapbox-gl 2.7.1`, `react-17.0.2`and `react-scripts 5.0.0`. All dependencies can be found in the `package.json` file. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Backend

The backend is deployed using Flask and Python 3.9. The `pyDataverse` and `flask` modules are required dependencies. To start the app, run `flask run` in the `backend` directory. *NOTE: The project expects the backend at port 5000, so if you change that, please edit API calls in the frontend. It is recommended to use a VirtualEnv to run the app, to create one run `python3 -m venv env3` in the terminal, and then `source env3/bin/activate`. 

