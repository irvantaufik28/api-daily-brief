FROM node:22.17.0

WORKDIR /app

# Copy only the package files to install dependencies first (for better caching)
COPY package.json yarn.lock* package-lock.json* ./

RUN yarn install

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Expose port (optional if not needed for worker)
EXPOSE 8080

# Set default command to run the worker
CMD ["node", "dist/queue/emailQueue.js"]
