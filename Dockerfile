# Stage 1: Build
FROM node:23 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:23 AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY .env.development ./

COPY --from=build /app/package.json /app/package-lock.json ./

RUN npm install --production

CMD ["npm", "run", "start"]
