FROM node:20-alpine AS builder

WORKDIR /app

COPY implementation-nodejs/wallet-service/package*.json ./

RUN npm install

COPY implementation-nodejs/wallet-service .

FROM node:20-alpine 

WORKDIR /root/

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/src ./src

COPY proto ./proto

EXPOSE 60053

CMD ["node", "src/index.js"]