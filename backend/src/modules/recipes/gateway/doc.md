
# WebSocket Gateway

El `RecipesGateway` es el núcleo de la edición colaborativa. Utiliza **Socket.io** para gestionar la presencia de usuarios y la sincronización de cambios en tiempo real mediante el concepto de **Salas (Rooms)**.

---

## Seguridad y Conexión

* **Autenticación:** Se requiere un JWT válido en el handshake (`authorization` header). Si no se provee, la conexión es rechazada inmediatamente.
* **WsGuard** Todos los mensajes de suscripción están protegidos por `WsGuard` siguiendo la documentación de NestJS.
* **Identificación:** El cliente debe mapear el objeto `user` en el socket para permitir el seguimiento de quién realiza cada acción.


---

## Catálogo de Mensajes (API de Eventos)

### Eventos de Entrada (Client -> Server)

Mensajes que el servidor escucha desde el frontend de Angular:

#### 1. `viewing-recipe`
* **Objetivo:** Notificar que un usuario entró a ver una receta específica.
* **Acción:** El servidor une el socket a una sala llamada `recipe-{id}` y emite la lista actualizada de usuarios presentes.
* **Payload:** `{ "recipeId": "string" }`

#### 2. `stop-viewing-recipe`
* **Objetivo:** Notificar que un usuario cerró o salió de la vista de una receta.
* **Acción:** El servidor remueve al usuario de la sala y notifica a los demás la salida.
* **Payload:** `{ "recipeId": "string" }`


#### 3. `edit-recipe-field`
* **Objetivo:** Sincronizar cambios en los datos de la receta y persistirlos.
* **Acción:** 1. Actualiza la base de datos mediante el `RecipesService`.
    2. Emite el cambio a todos los demás miembros de la sala.
* **Payload:** `{ "recipeId": "string", "data": "Partial<CreateRecipeDto>" }`


#### 4. `input-focus` (por implementar/recomendado)
* **Objetivo:** Indicar que un usuario está posicionado (focus) sobre un campo de entrada específico.
* **Acción:** Emite un broadcast a la sala para que otros vean qué campo está "bloqueado" o siendo editado.
* **Payload:** `{ "recipeId": "string", "inputId": "InputRecipeFields" }`


### Gestión de Salas (Rooms)
El Gateway utiliza salas dinámicas para evitar el "broadcast global". Los mensajes de una receta solo llegan a los usuarios que están visualizando esa receta específica:
```typescript
const recipeRoom = `recipe-${recipeId}`;
client.join(recipeRoom);