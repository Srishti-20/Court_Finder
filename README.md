# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Pickleball Court Finder

## Description
The **Pickleball Court Finder** is a web application designed to help users find pickleball courts in their area. It allows users to search for courts by location, filter courts based on proximity, and view additional information such as court type, access, lighting, and booking options. The map is interactive, and users can easily find details about each court by clicking on markers on the map.

---

## Features

- **Search Bar**: Search courts based on name or location.
- **Filter by Distance**: Filter courts by a specified range in kilometers.
- **Interactive Map**: View a map with markers for each court, with the option to zoom in and out.
- **Court Metadata**: Display detailed information about a court, including:
  - Name
  - Location
  - Court Type
  - Access and Lighting options
  - Google Maps link for navigation
  - Court booking link
- **Autocomplete Suggestions**: Dynamically display suggestions while searching for courts.

---

## Tech Stack

- **Frontend**: React.js, React-Leaflet, MUI
- **Backend**: (If any, you can specify here)
- **Map**: Leaflet.js for map rendering and interactivity
- **Styling**: CSS for layout, styling, and responsiveness

---

## Installation

### Requirements

- Node.js (preferably the latest LTS version)
- npm or yarn (to manage dependencies)

### Steps to Run the Application Locally

1. Clone the repository to your local machine.

    ```bash
    git clone <repo_url>
    ```

2. Navigate to the project directory.

    ```bash
    cd pickleball-court-finder
    ```

3. Install the necessary dependencies using npm or yarn.

    ```bash
    npm install
    ```

4. Run the development server.

    ```bash
    npm start
    ```

    The application should now be running on `http://localhost:3000`.

---

## Usage

1. **Search for a Court**: Type a court name or location in the search bar. Autocomplete suggestions will appear.
2. **Filter by Distance**: Use the dropdown to filter courts based on your desired distance range.
3. **Map Interaction**: Click on the markers on the map to view more information about each court. If you select a court, the map will zoom in to its location.

---

## Folder Structure

```bash
├── public/              # Public assets
├── src/                 # Source code
│   ├── components/      # Reusable components (e.g., SearchBar, CourtMetadataBox, MapComponent)
│   ├── App.js           # Main application component
│   ├── index.js         # Entry point for React
│   └── styles.css       # Global styles
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```
---

### Steps to Use the Template:

1. **Copy the Markdown template** into a file called `README.md` in the root of your project directory.
2. **Update the placeholders** like `<repo_url>` with the actual URL of your project repository.
3. **Review the Tech Stack** and change it if necessary (you can add backend details if applicable).
4. **Update Installation Instructions** based on any additional setup instructions or specific steps for your environment.

Once you're done, your `README.md` will provide a comprehensive and clear guide to your project! Let me know if you want to make any further changes or additions.