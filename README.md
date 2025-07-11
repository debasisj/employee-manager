# Employee Manager

This project is a full-stack Employee Management application built with **React** (frontend) and a **Java REST API** (backend). It allows you to create, view, edit, and delete employees, with roles such as Director, Tech, and Product. The UI uses Material-UI (MUI) for a modern look and feel.

## Features

- List all employees with their name and role
- Add a new employee
- Edit existing employee details
- Delete employees
- Success and error banners for user actions
- Accessible and tested with React Testing Library and Playwright

## Project Structure

- **/src**: React frontend code (components, services, tests)
- **/rest-app**: Java REST API (run as a JAR)
- **/playwright-tests**: End-to-end tests using Playwright

## Available Scripts

In the project directory, you can run:

### `npm run start:rest`

Starts the Java REST API backend (`rest-app/rest-0.0.1-SNAPSHOT.jar`) on [http://localhost:8080](http://localhost:8080).

### `npm run start:react`

Starts the React frontend on [http://localhost:3000](http://localhost:3000).

### `npm run start:all`

Starts both the REST API and React frontend in parallel.

### `npm test`

Runs the React unit and integration tests using React Testing Library and Jest.

### `npm run test:e2e`

Starts both backend and frontend, then runs Playwright end-to-end tests (see `playwright-tests/`).

### `npm run build`

Builds the React app for production to the `build` folder.

## Testing

- **Unit/Integration:** Run `npm test` for React component and service tests.
- **E2E:** Run `npm run test:e2e` for Playwright browser-based tests.  
  Make sure both backend and frontend are not already running, as the script will start them.

## Tech Stack

- **Frontend:** React, TypeScript, Material-UI (MUI)
- **Backend:** Java (Spring Boot REST API)
- **Testing:** Jest, React Testing Library, Playwright

## Getting Started

1. Make sure you have Java and Node.js installed.
2. Backend JAR already provided in the repo at  `rest-app/rest-0.0.1-SNAPSHOT.jar`
3. Install dependencies:  
   `npm install`
4. Start both servers:  
   `npm run start:all`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT

---

*This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).*
