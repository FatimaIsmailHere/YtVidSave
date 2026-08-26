FROM node:20-slim

# Install Python, yt-dlp, and ffmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install --break-system-packages yt-dlp

# Verify installations
RUN yt-dlp --version && ffmpeg -version | head -1

WORKDIR /app

# Install Node dependencies
COPY server/package.json ./
RUN npm install --omit=dev

# Copy server code
COPY server/server.js ./

EXPOSE 3001

CMD ["node", "server.js"]
