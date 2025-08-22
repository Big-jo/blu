# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install deps first (layer caching)
COPY package*.json yarn.lock ./
RUN yarn install

# Copy app code
COPY . .

# Build NestJS project
RUN yarn run build

# Expose app port
EXPOSE 3000

# Run app
CMD ["yarn", "run", "start:prod"]

