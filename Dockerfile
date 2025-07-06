# Build stage for client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Build stage for API
FROM node:20-alpine AS api-builder
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci
COPY api/ .
RUN npm run build

# Final stage
FROM nginx:alpine
WORKDIR /app

# Install Node.js for running the API
RUN apk add --no-cache nodejs npm

# Copy built client assets
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Copy API files
COPY --from=api-builder /app/api/dist ./api
COPY --from=api-builder /app/api/package*.json ./api/

# Install API dependencies
WORKDIR /app/api
RUN npm ci --production

# Configure Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start both Nginx and the API
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
ENV EXPO_PUBLIC_ENV=production
CMD ["/start.sh"]
