FROM node:18

WORKDIR /app

# Copy dependencies file for cache optimization
COPY package.json yarn.lock* package-lock.json* ./

RUN yarn install

# Copy source files
COPY . .

# Build TypeScript project
RUN yarn build

# Copy template files manually to dist if needed at runtime
RUN mkdir -p dist/templates && cp -r src/templates/* dist/templates/

EXPOSE 8080

CMD ["node", "dist/main.js"]
