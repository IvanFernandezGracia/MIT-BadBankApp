FROM node:14.17.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm" ,"start"]
