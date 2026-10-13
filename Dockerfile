# ---------- 1) build the React client ----------
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ---------- 2) production image: Express API + built client ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=5000

COPY server/package*.json ./server/
RUN npm ci --omit=dev --prefix server

COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server/src/index.js"]
