# Glama / registry introspection image for UnlockFlow MCP (stdio).
# Illustrative seeds only. NFA — not a live authenticated Agent Feed.
FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY data ./data
COPY src ./src
COPY server.json ./
COPY scripts ./scripts
ENV NODE_ENV=production
CMD ["npm", "start"]
