FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 22611

CMD ["node", "src/main.js"]
ENV JWT_SECRET=EbykO5rtXNmN8PGLhixGlZJ+RgxAZ2YI0d+PhfLeBCI=