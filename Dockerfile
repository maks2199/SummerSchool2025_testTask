FROM node:18-slim

WORKDIR /app

# COPY package.json package-lock.json /app/
# COPY public/ /app/public
# COPY dist/ /app/dist
# COPY src/ /app/src

COPY . . 

# Устанавливаем зависимости
#RUN npm install && npm install @jridgewell/gen-mapping
RUN npm ci --force

# Создаём директорию для кеша ESLint
RUN mkdir -p /app/node_modules/.cache && \
    chmod -R 775 /app/node_modules/.cache



EXPOSE 8080

CMD ["npm", "start"]