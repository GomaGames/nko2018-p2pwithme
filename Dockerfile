FROM node:alpine

WORKDIR /app
COPY . /app

RUN npm install --production

EXPOSE 8080

CMD ["npm", "start"]
