# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 5000

# Instalar MySQL
RUN apt-get update && \
    apt-get install -y mysql-server

# Copiar el script de inicialización de la base de datos
COPY schema.sql /docker-entrypoint-initdb.d/

# Comando para ejecutar la aplicación
CMD service mysql start && \
    mysql -u root -p12345 < /docker-entrypoint-initdb.d/schema.sql && \
    node main.js
