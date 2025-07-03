# Usa la imagen base oficial de Node
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto que usa NestJS
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "start:prod"]
