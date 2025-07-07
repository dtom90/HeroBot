# Build stage for client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
COPY shared/ ../shared/
RUN npm run build

# Final stage
FROM nginx:alpine
WORKDIR /app

# Install Node.js for running the API
RUN apk add --no-cache nodejs npm

# Copy built client assets
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Copy API source files and package.json
COPY api/ ./api/
COPY shared/ ./shared/

# Install API dependencies and build
WORKDIR /app/api
RUN npm ci
RUN npm run build

# Configure Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start both Nginx and the API
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
ENV EXPO_PUBLIC_ENV=production
CMD ["/start.sh"]
