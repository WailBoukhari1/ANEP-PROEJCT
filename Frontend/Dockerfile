# Use Alpine Linux version 3.19
FROM alpine:3.19

# Install Node.js and npm
RUN apk add --update nodejs npm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build the application for production
RUN npm run build

# Expose port 5173 for access from outside the container
EXPOSE 5173

# The command to run the app
CMD ["npm", "run", "dev"]

