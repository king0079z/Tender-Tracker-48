#!/bin/bash

# Install production dependencies
npm install --production

# Build the application
npm run build

# Copy necessary files to dist
cp package*.json dist/
cp server.js dist/
cp web.config dist/

# Install production dependencies in dist
cd dist
npm install --production

# The deployment script will automatically deploy the contents of this directory