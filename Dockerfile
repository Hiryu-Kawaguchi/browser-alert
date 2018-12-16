FROM node:10.14.2
WORKDIR /
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json
COPY ./.babelrc /.babelrc
COPY ./webpack.config.js /webpack.config.js

RUN npm install
CMD npm run watch