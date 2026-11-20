# Ryad Al Aqsa - Docker Image
FROM node:20-alpine

WORKDIR /app

# Copy backend
COPY backend/ ./backend/

# Copy frontend
COPY index.html styles.css app.js i18n.js manifest.json sw.js logo.svg ./ 

# Create certs directory
RUN mkdir -p backend/certs

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV STORAGE_TYPE=json
ENV USE_HTTPS=false

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/institution || exit 1

CMD ["node", "backend/server.js"]