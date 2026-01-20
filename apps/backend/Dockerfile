FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/types/package*.json ./packages/types/
COPY packages/utils/package*.json ./packages/utils/

RUN npm install

COPY . .

RUN npm run build --workspace=packages/types
RUN npm run build --workspace=packages/utils
RUN npm run build --workspace=apps/backend

CMD ["npm", "run", "start:prod", "--workspace=apps/backend"]
