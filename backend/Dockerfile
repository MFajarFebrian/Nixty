# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
# We need schema.sql for initialization if we decide to run migrations here.
# For simplicity, we'll copy src for reference or migration scripts if needed.
COPY src/schema.sql ./src/schema.sql 

EXPOSE 3001
CMD ["node", "dist/server.js"]
