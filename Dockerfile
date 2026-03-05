FROM node:20-alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["sh", "-c", "npm run setup && npx react-router-serve ./build/server/index.js"]
