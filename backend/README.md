# Backend Documentation

The backend for this project is structured using a Flask app. It uses the `pyDataverse` package to pull down data from the Dataverse instance, and then processes it server-side, before serving it to the frontend via HTTP.

This backend is still a WIP, and the organization is still a single page structure as of right now, using just the one `app.py`. This is scheduled to change soon, but for a Proof of Concept design, it was decided that a single file concept would be fine.

The backend exposes an API, at route `/api`. This API has a variety of routes.
- `/api/counties/<COUNTY_NAME`>`: Get the GeoJSON polygon corresponding to the boundary of a county in Ohio. First letter capitalized.
- `/api/SAMASA`: Pulls data from the SAMASA reporting system.
- `/api/Project_Down`
- `/api/NPPES`: Pull data from the NPPES data
- `/api/zipcodes`: Zip Code map of Ohio (note: this does not filter the zipcodes for the Jackson and Scioto Counties, and instead chooses to show the entirety of Ohio.)
- `/api/NIBRS/<year>`: Pulls data from the National Incident-Based Reporting System for the year selected, at the county level. City-level data is a WIP.