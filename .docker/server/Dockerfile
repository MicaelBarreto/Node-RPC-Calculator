FROM node:12

# Create app directory
WORKDIR /usr/src/app

COPY ./server/package*.json ./

RUN npm install

COPY ./server .

# EXPOSE 3001

CMD [ "node", "app.js" ]