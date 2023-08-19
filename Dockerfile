FROM node:18.17.1-alpine

WORKDIR /app

ADD package.json /app/package.json

RUN npm install --force

ADD . /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]