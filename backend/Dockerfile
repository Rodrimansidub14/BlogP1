# Usar la imagen oficial de Node.js
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de configuración de NPM
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto 5000
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["node", "src/main.js"]
