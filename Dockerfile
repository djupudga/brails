FROM node:10.8.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY . .
RUN npm link
CMD ["brails"]
