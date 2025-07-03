# Bidcom Challenge API

## Objetivo

Este proyecto es una API desarrollada con NestJS, MongoDB y Docker, que permite crear y gestionar enlaces acortados protegidos con contraseña y con fecha de expiración opcional. 
El sistema expone endpoints REST para:
* Crear enlaces (links) personalizados y seguros
* Redirigir URLs protegidas
* Consultar estadísticas de uso de un link
* Invalidar manualmente un link

## Arquitectura
### Tecnologías

- **NestJS**: Framework backend basado en Node.js
- **MongoDB**: Base de datos NoSQL para almacenar los links
- **Docker**: Contenerización para despliegue fácil y reproducible
- **Swagger**: Documentación de la API

### Estructura
```
src/
├── links/                    # Módulo principal de la app
│   ├── dto/                  # DTOs de validación de datos
│   ├── entities/             # Esquemas de Mongoose
│   ├── guards/               # Guard para validación de contraseñas (middleware)
│   ├── interfaces/           # Tipado de Express extendido
│   ├── links.controller.ts
│   ├── links.service.ts
├── utils/                    # generador de ids para los links en utils
├── main.ts                   # Punto de entrada de la aplicación
```

## Documentación de la API
* **Swagger disponible en**: http://localhost:3000/api

### Endpoints
#### **Crear enlace**: (POST /create)
* Request:
    ```
    {
      "url": "https://google.com",
      "password": "1234",                   // opcional
      "expiresAt": "2025-12-31T23:59:59Z"   // opcional
    }
    ```
* Response:
    ```
    {
      "target": "https://google.com",
      "link": "http://localhost:3000/l/abc123",
      "valid": true
    }
    ```

#### **Redirigir a un enlace**: (GET /l/:id?password=1234)
* Redirige al enlace original si es válido y la contraseña (si existe) es correcta.

#### **Invalidar un enlace manualmente**: (PUT /invalidate/****:id)
Response:
    ```
    {
      "message": "Link invalidado correctamente",
      "shortId": "abc123"
    }
    ```

* **Consultar estadísticas de un enlace**: (GET /l/:id/stats)
  Response:
    ```
    {
      "shortId": "abc123",
      "originalUrl": "https://google.com",
      "redirectCount": 5,
      "createdAt": "2024-07-01T14:00:00.000Z",
      "expiresAt": "2025-01-01T00:00:00.000Z",
      "valid": true
    }
    ```

## Validaciones implementadas
* El campo url es obligatorio y debe ser válido
* La contraseña (password) es opcional
* Si se define expiresAt, se compara contra la fecha actual para invalidar automáticamente
* Se puede invalidar manualmente un link
* Se contabilizan los accesos a cada link

## Cómo ejecutar el proyecto
### Requisitos
* Docker Desktop instalado
* Node.js 18+ (solo si no usás Docker)

### Usando Docker
1. Clonar el repositorio:
```
  git clone https://github.com/DardoJav/bidcom-challenge.git
  cd bidcom-challenge
```

2. Crear archivo .env con estas variables: (salvo que este en el proyecto pusheado)
```
  PORT=3000
  MONGO_URI=mongodb://mongo:27017/bidcom-challenge
```

3. Ejecutar:
```
  docker-compose up --build
```

4. La API estará disponible en:
```
  http://localhost:3000
```
  Y Swagger en:
```
  http://localhost:3000/api
```

### Testing
* Para correr los tests:
```
  npm run test
```

## Acceso a base de datos
Para probar chequear los datos es posible conectarse usando:
**URI:** mongodb://localhost:27017/bidcom-challenge
**Compass:** utilice la URI anterior en MongoDB Compass

## Notas
* Todos los endpoints están documentados y validados.
* Se utilizó una arquitectura modular.
* Se puede extender fácilmente para incluir autenticación u otras restricciones que no las puse porque no venian al caso del challenge.
* Por cuestiones de tiempo no pude desplegar la aplicacion y dejarla andando en algun servidor como "railway"
* El README esta en castellano solo por cuestion de comodidad para el challenge. El codigo si esta en ingles.
