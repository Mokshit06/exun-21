FROM node:14

WORKDIR /app

# RUN npm i -g yarn

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

CMD ["yarn", "start"]