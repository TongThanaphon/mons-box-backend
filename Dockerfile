# # Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim as build

# Create and change to the app directory.
WORKDIR /usr/src/app

# setup lerna repo
COPY package.json ./
COPY yarn.lock ./

# install all depencencies
RUN yarn --frozen-lockfile

# copy required projects
COPY . ./

# prepare node process env
ARG DEPLOYMENT_ENV=prod
ENV DEPLOYMENT_ENV=$DEPLOYMENT_ENV

# build nest
RUN yarn build

# run nest
CMD yarn start