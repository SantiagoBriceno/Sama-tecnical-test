import { createAction, props } from '@ngrx/store';
import { InputRecipeFields } from '../types/collab';
import { Recipe } from '../../recipes/types/recipe';

// Action para iniciar la conexión en el socket
export const connect = createAction('[Collab] Connect');

export const connectSuccess = createAction('[Collab] Connect Success');

export const connectFailure = createAction('[Collab] Connect Failure', props<{ error: any }>());

// Action para desconectar el socket

export const disconnect = createAction('[Collab] Disconnect');

export const disconnectSuccess = createAction('[Collab] Disconnect Success');

export const disconnectFailure = createAction(
  '[Collab] Disconnect Failure',
  props<{ error: any }>(),
);

// Action para conectarse a una sala de una receta específica
export const joinRoom = createAction('[Collab] Join Room', props<{ recipeId: string }>());

export const joinRoomSuccess = createAction('[Collab] Join Room Success');

export const joinRoomFailure = createAction('[Collab] Join Room Failure', props<{ error: any }>());

// Action que se despacha cuando un nuevo usuario se une a la sala
export const userJoinedRoomSuccess = createAction(
  '[Collab] User Joined Room Success',
  props<{ recipeId: string; users: string[] }>(),
);

// Action para salir de una sala
export const leaveRoom = createAction('[Collab] Leave Room', props<{ recipeId: string }>());

export const leaveRoomSuccess = createAction('[Collab] Leave Room Success');

export const leaveRoomFailure = createAction(
  '[Collab] Leave Room Failure',
  props<{ error: any }>(),
);


export const setUsersInRoom = createAction(
  '[Collab] Set Users In Room',
  props<{ recipeId: string; users: string[] }>(),
);

// PARA FUTURAS MEJORAS
export const setInputFocus = createAction(
  '[Collab] Set Input Focus',
  props<{ recipeId: string; inputId: InputRecipeFields }>(),
);

// Para futuras mejoras implementar el blur también


export const setRecipeToEdit = createAction(
  '[Collab] Set Recipe To Edit',
  props<{ recipe: Recipe }>(),
);

// Action para indicar que un usuario hizo cambios en una receta
export const recipeChanged = createAction(
  '[Collab] Recipe Changed',
  props<{ recipeId: string; changes: Partial<Recipe> }>(),
);

export const recipeChangeReceived = createAction(
  '[Collab] Recipe Change Received',
  props<{ recipeId: string; data: Partial<Recipe>; message: string }>(),
);


