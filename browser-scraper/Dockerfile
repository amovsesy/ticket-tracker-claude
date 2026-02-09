# Use official Puppeteer image (includes Chrome)
FROM ghcr.io/puppeteer/puppeteer:21.11.0

# Set working directory
WORKDIR /home/pptruser/app

# Copy package files
COPY --chown=pptruser:pptruser package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY --chown=pptruser:pptruser . .

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Run as non-root user
USER pptruser

# Start the application
CMD ["node", "index.js"]
