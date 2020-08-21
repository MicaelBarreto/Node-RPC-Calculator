FROM node:12

# Create app directory
WORKDIR /usr/src/app

COPY ./client/package*.json ./

RUN npm install
RUN npm install -g browserify

COPY ./client .

RUN cd scripts/ && browserify json-rpc.js -o bundle.js

# EXPOSE 3001

CMD [ "node", "app.js" ]