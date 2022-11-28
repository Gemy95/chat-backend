FROM node:18-alpine As production

WORKDIR /usr/src/service

COPY ./package.json /usr/src/service/package.json
COPY ./package-lock.json /usr/src/service/package-lock.json

RUN npm i 

COPY . /usr/src/service

CMD npm run start:dev