# Prueba Técnica - Desarrollador FullStack Sama
## Introducción
Primero que todo, agradezco la oportunidad de participar en el proceso de selección para el puesto de Desarrollador FullStack en Sama. He desarrollado la prueba técnica siguiendo las indicaciones proporcionadas en el enunciado.

El Stack tecnológico utilizado incluye:
- Frontend: AngularJS con Angular Material para la interfaz de usuario.
- Backend: Node.js con NestJS para la API REST y Socket.IO para la comunicación en tiempo real.


## Observaciones y Recomendaciones
Durante el desarrollo de la prueba técnica me enfrenté a varios desafíos que me permitieron aprender y mejorar mis habilidades; el uso del framework NestJS facilitó la estructuración del backend, mientras que AngularJS permitió una rápida creación de la interfaz de usuario. Sin embargo, algunas áreas podrían beneficiarse de mejoras adicionales:
- **Validación de Datos**: Aunque se implementaron validaciones básicas, se recomienda una validación más robusta tanto en el frontend como en el backend para garantizar la integridad de los datos.
- **Manejo de Respuestas**: Se podrían mejorar los mensajes respuesta estandarizandolos para facilitar la interpretación por parte del cliente tanto en respuestas exitosas como en errores.
- **Mensajes en Tiempo Real**: La implementación actual de Socket.IO es funcional, pero se podría optimizar el manejo de eventos para perfeccionar la experiencia del usuario en el escenario colaborativo planteado, mostrando detalles para evitar la sobrescritura de datos.

## Instrucciones para Ejecutar la Aplicación
- Clonar el repositorio:
  ```bash
  git clone <URL_DEL_REPOSITORIO>
  cd <NOMBRE_DEL_REPOSITORIO>
  ```
- Crear archivos de configuración:
  - Entorno: Crear un archivo `.env` en la carpeta raíz con las variables necesarias (Ver .env.example para referencia)
  - Backend: Crear un archivo `.env` en la carpeta `backend` con las variables necesarias (Ver .env.example para referencia)
  - Frontend: Crear un archivo `.env` en la carpeta `frontend` vacío (evitar errores con la dockerización)
  - Ejecutar Docker Compose:
  ```bash
  docker-compose up --build
  ```
  

## Recomendaciones para Testing
- **Cobertura de Pruebas**: Asegurar una alta cobertura de pruebas unitarias para todos los servicios y componentes críticos (En este caso solo se hicieron pruebas al servicio de autenticación, componente Login y componente Register).
- **Pruebas E2E**: Implementar pruebas end-to-end para simular flujos de usuario completos y garantizar que todas las partes de la aplicación funcionen correctamente juntas. Angular ofrece herramientas nativas para esto como Protractor o Cypress que pueden ser útiles, sin embargo Playwright se posiciona como la herramienta más robusta y moderna para este propósito.
