# Building layer
FROM node:18-alpine as development

WORKDIR /app

# Copy configuration files
COPY package*.json ./
# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci

# Copy application sources (.ts, .tsx, js)
COPY . .

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:16-alpine as production

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --production

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3001

# Start application
CMD [ "node", "dist/main.js" ]