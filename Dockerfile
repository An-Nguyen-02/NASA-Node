FROM node:lts-alpine

WORKDIR /app

# just need package.json copied into the root folder, remember to ignore node_modules, .git
COPY package*.json ./

COPY client/package*.json client/
# Run multiple layer because docker save state at each layer
RUN npm run install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

COPY server/ server/

COPY client/ client/
RUN npm run build --prefix client

USER node

CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000