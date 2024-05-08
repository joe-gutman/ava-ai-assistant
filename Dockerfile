# syntax=docker/dockerfile:1

# Use a Node.js base image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Expose the port that your application listens on
EXPOSE 3000

# Start a Node.js shell
CMD ["node"]
