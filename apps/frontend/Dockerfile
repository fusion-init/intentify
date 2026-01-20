FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/types/package*.json ./packages/types/
COPY packages/utils/package*.json ./packages/utils/

RUN npm install

COPY . .

RUN npm run build --workspace=packages/types
RUN npm run build --workspace=packages/utils
RUN npm run build --workspace=apps/frontend

CMD ["npm", "run", "start", "--workspace=apps/frontend"]
