FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/react-app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Multi-stage build implementation

FROM node:18-alpine as PRODUCTION_IMAGE
WORKDIR /app/react-app

# copy /app/react-app/dist folder from BUILD_IMAGE to
# /app/react-app/dist in this stage
COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/

EXPOSE 8080

COPY package.json .
COPY vite.config.ts .
COPY .env .env

RUN npm install typescript

ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT

EXPOSE 8080

CMD [ "npm", "run", "preview" ]