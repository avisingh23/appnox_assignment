# The Base Image
FROM node:14.15.4

# Hello!
LABEL maintainer="Avnish <avnishtomar87@gmail.com>"

# Create the application directory
RUN mkdir -p /home/app

# Copy over package.json
COPY ["./package.json", "./package-lock.json", "/home/app/"]

# Here we go
WORKDIR /home/app

# Copy over application
COPY ./dist /home/app

# Install Node Dependencies
RUN npm install --only=production

RUN npm install pm2 -g

# Lift off!
CMD ["pm2-runtime", "index.js"]
