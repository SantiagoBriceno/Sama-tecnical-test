FROM node:20-alpine
RUN apk add --no-cache curl # Necesario para tu healthcheck
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]