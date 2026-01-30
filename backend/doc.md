# Documentación Técnica - Backend
## Introducción
En esta documentación se detalla la configuración y estructura del backend desarrollado con NodeJS haciendo uso del Framework de desarrollo NestJS.

Este aplicativo en cuestión se basa en la creación de recetas de cocina, con una capa de autenticación de usuarios permitiendo que solo usuarios registrados puedan crear, editar o eliminar recetas. Además de esto, se implementa una funcionalidad Realtime que permite a varios usuarios conectados editar una misma receta de forma simultánea.

La aplicación fue desarrollada siguiendo a cabalidad las mejores prácticas recomendadas por la documentación oficial de NestJS y siguiendo una arquitectura API RESTful con un módulo adicional para la gestión de WebSockets.


## 🛠️ Stack Tecnológico

* **Core:** [NestJS 11](https://nestjs.com/) (Node.js framework)
* **Lenguaje:** TypeScript 5.7
* **Base de Datos:** PostgreSQL (vía **TypeORM**)
* **Seguridad:** JWT (Gestión de sesiones) & Bcrypt (Encriptación de contraseñas)
* **Real-time/gateway:** Socket.io (WebSockets)
* **Validación:** Class-validator & Class-transformer

## ⚙️ Configuración del Proyecto

### 1. Requisitos previos
* Node.js (v18 o superior)

### 2. Instalación
```bash
npm install
```