# Documentación Técnica - Frontend
## Introducción
En esta documentación se detalla la configuración y estructura del Frontend desarrollado con NodeJS haciendo uso del Framework de desarrollo Angular.

Este aplicativo en cuestión se basa en la creación de recetas de cocina, teniendo a disposición del usuario vistas con las cuales podrá visualizar, crear, eliminar y editar de manera colaborativa recetas de cocina, además de contar con un sistema de autenticación y autorización para gestionar el acceso a las diferentes funcionalidades de la aplicación.

## 💻 Stack Tecnológico (Frontend)

El frontend está desarrollado bajo una arquitectura orientada a componentes y gestión de estado reactiva.

* **Framework:** [Angular 21](https://angular.dev/) (Última generación)
* **Gestión de Estado:** [NgRx v21](https://ngrx.io/) (Store & Effects) para un flujo de datos unidireccional y predecible.
* **Interfaz de Usuario (UI):** [Angular Material](https://material.angular.io/) & CDK para componentes de diseño profesionales y accesibles.
* **Comunicación en Tiempo Real:** [Socket.io-client](https://socket.io/docs/v4/client-api/) para la sincronización de la edición colaborativa.
* **Programación Reactiva:** [RxJS 7.8](https://rxjs.dev/) para el manejo de flujos de eventos asíncronos.
* **Unit Testing:** [Vitest](https://vitest.dev/) (Sustituyendo a Karma/Jasmine por mayor velocidad en entornos modernos).
* **Calidad de Código:** Prettier (configurado para consistencia en HTML y TypeScript).

## Configuración del Proyecto

### 1. Requisitos previos
* Node.js (v18 o superior)
* Instancia de base de datos (PostgreSQL o MySQL)

### 2. Instalación
```bash
npm install