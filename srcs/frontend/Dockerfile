FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.html ./
COPY vite.config.js ./
COPY src ./src

EXPOSE 8080

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]