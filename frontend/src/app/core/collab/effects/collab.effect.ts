import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CollabService } from '../services/collab.service';
import * as collabAction from '../store/collab.action';
import { catchError, map, switchMap, tap } from 'rxjs';
import { ToastService } from '../../../shared/toast/toast';

@Injectable()
export class CollabEffect {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private collabService = inject(CollabService);
  private notificationToast = inject(ToastService);

  // Efecto que conecta al socket cuando se despacha la acción 'connect'
  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.connect),
      map(() => {
        this.collabService.connect();
        return collabAction.connectSuccess();
      }),
    ),
  );

  // Efecto que se despacha cuando un usuario comienza a ver una receta
  viewingRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.joinRoom),
      map(({ recipeId }) => {
        this.collabService.viewingRecipe(recipeId);
        return collabAction.joinRoomSuccess();
      }),
    ),
  );

  // efecto que se despacha cuando un usuario deja de ver una receta
  leftRecipeView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.leaveRoom),
      map(({ recipeId }) => {
        this.collabService.leftRecipeView(recipeId);
        return collabAction.leaveRoomSuccess();
      }),
    ),
  );

  // efecto que se despacha cuando un usuario hace focus en un input de la receta (FUTURA MEJORA)
  inputFocus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.setInputFocus),
      map(({ recipeId, inputId }) => {
        this.collabService.onInputFocus(recipeId, inputId);
        return { type: '[Collab] Input Focus Emitted' };
      }),
    ),
  );

  inputBlur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.setInputBlur),
      map(({ recipeId, inputId }) => {
        this.collabService.onInputBlur(recipeId, inputId);
        return { type: '[Collab] Input Blur Emitted' };
      }),
    ),
  );

  emitRecipeChanges$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(collabAction.recipeChanged),
        map(({ recipeId, changes }) => {
          this.collabService.emitRecipeChanges(recipeId, changes);
        }),
      ),
    {
      dispatch: false,
    },
  );

  // Listeners para los eventos dentro de la sala colaborativa
  listenerViewSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.joinRoomSuccess),
      switchMap(() =>
        this.collabService.newUserJoined().pipe(
          map((data) => {
            this.notificationToast.show(
              'Un nuevo usuario se ha unido a la edición colaborativa.',
              'info',
            );
            return collabAction.setUsersInRoom({ recipeId: data.recipeId, users: data.users });
          }),
        ),
      ),
    ),
  );

  listenerUserLeft$ = createEffect(() =>
    this.actions$.pipe(
      // Empezamos a escuchar cuando el usuario entra a una sala con éxito
      ofType(collabAction.joinRoomSuccess),
      switchMap(() =>
        this.collabService.userLeft().pipe(
          map((data) => {
            // Reutilizamos la lógica de actualización del Store
            // O puedes crear una acción específica si quieres un Toast diferente
            this.notificationToast.show('Un usuario ha dejado la edición colaborativa.', 'info');
            return collabAction.setUsersInRoom({
              recipeId: data.recipeId,
              users: data.users,
            });
          }),
        ),
      ),
    ),
  );

  listenerRecipeChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.joinRoomSuccess),
      switchMap(() =>
        this.collabService.listenRecipeChanges().pipe(
          map((data) => {
            console.log('Recipe change received via collab service:', data);
            this.notificationToast.show(
              'La receta ha sido actualizada satisfactoriamente.',
              'info',
            );
            return collabAction.recipeChangeReceived({
              recipeId: data.recipeId,
              data: data.data,
              message: data.message,
            });
          }),
        ),
      ),
    ),
  );

  listenerFocusInputSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.joinRoomSuccess),
      switchMap(() =>
        this.collabService.listenInputFocusSuccess().pipe(
          map(({ recipeId, inputsOccupied }) => {
            return collabAction.setInputFocusSuccess({
              recipeId,
              inputsOccupied,
            });
          }),
        ),
      ),
    ),
  );

  listenerFocusInputFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.joinRoomSuccess),
      switchMap(() =>
        this.collabService.listenInputFailure().pipe(
          map(({ recipeId, inputsOccupied, message }) => {
            this.notificationToast.show(`No se pudo enfocar el campo: ${message}`, 'error');
            return collabAction.setInputFocusFailure({
              recipeId,
              inputsOccupied,
              message,
            });
          }),
        ),
      ),
    ),
  );

  listenerBlurInput$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collabAction.joinRoomSuccess),
      switchMap(() =>
        this.collabService.listenInputBlur().pipe(
          map(({ recipeId, inputsOccupied }) => {
            return collabAction.setInputBlurSuccess({
              recipeId,
              inputsOccupied,
            });
          }),
        ),
      ),
    ),
  );
}
