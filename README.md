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

## Building Docker Image
Replace {registry} in the following commands with the registry URL you are currently pushing/pulling your docker image from.
### Frontend

```docker build -t {registry}/pokemon-tracker-frontend .```

```docker push {registry}/pokemon-tracker-frontend```

### Backend

```docker build -t {registry}/pokemon-tracker-backend .```

```docker push {registry}/pokemon-tracker-backend```

## Deploying Docker Container
### Docker Compose Template
Replace {registry} in the following docker-compose template with the URL of wherever you are storying your docker images.

Also ensure to replace {your domain} with whatever domain you plan on hosting your page on.
```
version: "3.8"
services:
  poketracker-frontend:
    image: {registry}/pokemon-tracker-frontend
    ports:
     - "7001:8080"
    environment:
    - VITE_API_ENDPOINT="{your domain}/api"
    restart: unless-stopped
    container_name: "poketracker-frontend"



  poketracker-backend:
    image: {registry}/pokemon-tracker-backend
    ports:
     - "3000:3000"
    restart: unless-stopped
    container_name: "poketracker-backend"
    depends_on:
     - redis
    links:
     - poketracker-frontend
     - redis
    environment:
     - REDIS_URL=redis://cache

  redis:
    image: redis:4
    container_name: cache
    ports:
     - "6379:6379"
```
