FROM node:18-alpine AS build_image

WORKDIR /app/react-app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Multi-stage build implementation

FROM node:18-alpine AS production_image
WORKDIR /app/react-app

# copy /app/react-app/dist folder from BUILD_IMAGE to
# /app/react-app/dist in this stage
COPY --from=build_image /app/react-app/dist/ /app/react-app/dist/

EXPOSE 8080

COPY package.json .
COPY vite.config.ts .

RUN npm install typescript

RUN npm install \
    @fortawesome/fontawesome-svg-core \
    @fortawesome/free-solid-svg-icons \
    @fortawesome/react-fontawesome

RUN npm install bcryptjs

RUN npm install jsonwebtoken

EXPOSE 8080

CMD [ "npm", "run", "preview" ]