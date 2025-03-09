# Pokedex-Online
An online pokedex useful for completionists who have a large pokemon collection spanning multiple games.

Is currently being hosted by myself at https://pokemon.diarmid.ca/

## Setting Up Dev Environment
After cloning from the repo, make sure to install required packages in both the backend and frontend using `npm install`
Create a .env file in both the backend and frontend directories (so 2 .env files), and populate them with the following:  

frontend:  
`VITE_API_ENDPOINT=http://localhost:3000/api`  

backend:  
`DB_HOST=`  
`DB_USER=`  
`DB_PASS=`  
`DB_NAME=`  
`JWT_SECRET=`  
`JWT_REFRESH_SECRET=`  

Make sure the backend info matches your database connection details, don't leave them blank. Also make sure both your JWT_SECRET and JWT_REFRESH_SECRET remain secure.