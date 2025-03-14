# Pokedex-Online
An online pokedex useful for completionists who have a large pokemon collection spanning multiple games.

Is currently being hosted by myself at https://pokemon.diarmid.ca/

## Setting Up Dev Environment
### Installing Required Packages
After cloning from the repo, make sure to install required packages in both the backend and frontend using `npm install`

### Creating env Files
Create 2 .env files for the frontend, and one in the backend (so 3 .env files in total). Populate them and name them according to the following:  

frontend:  
.env:  
`VITE_API_ENDPOINT=http://localhost:3000/api`  

.env.preview (using the demo site as an example):
`VITE_API_ENDPOINT=https://pokemon.diarmid.ca/api`

backend:  
.env:  
`DB_HOST=`  
`DB_USER=`  
`DB_PASS=`  
`DB_NAME=`  
`JWT_SECRET=`  
`JWT_REFRESH_SECRET=`  

Make sure the backend info matches your database connection details, don't leave them blank. Also make sure both your JWT_SECRET and JWT_REFRESH_SECRET remain secure.
