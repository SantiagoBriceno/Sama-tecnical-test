import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { io, Socket } from 'socket.io-client';
import { selectToken } from '../../auth/store/auth.selector';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { InputRecipeFields } from '../types/collab';
import { Recipe } from '../../recipes/types/recipe';

@Injectable({
  providedIn: 'root',
})
export class CollabService {
  private readonly server: string = environment.server;
  private socket: Socket | null = null;
  private readonly store = inject(Store);

  connect() {
    this.store.select(selectToken).subscribe((token) => {
      // Si hay una conexión previa, la cerramos
      if (this.socket) return;

      this.socket = io(this.server, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.socket.on('connect', () => {
        console.log('Conectado al servidor de colaboración en tiempo real');
      });
    });
  }

  viewingRecipe(recipeId: string) {
    this.socket?.emit('viewing-recipe', { recipeId });
  }

  newUserJoined(): Observable<{ recipeId: string; message: string; users: string[] }> {
    console.log('Setting up newUserJoined listener');
    return new Observable((observer) => {
      this.socket?.on(
        'recipe-new-user',
        (data: { recipeId: string; message: string; users: string[] }) => {
          observer.next(data);
        },
      );
    });
  }

  leftRecipeView(recipeId: string) {
    this.socket?.emit('stop-viewing-recipe', { recipeId });
  }

  userLeft(): Observable<{ recipeId: string; message: string; users: string[] }> {
    console.log('Setting up userLeft listener');
    return new Observable((observer) => {
      this.socket?.on(
        'recipe-user-left',
        (data: { recipeId: string; message: string; users: string[] }) => {
          observer.next(data);
        },
      );
    });
  }

  // PARA FUTURAS MEJORAS IMPLEMENTAR EL BLUR TAMBIÉN
  onInputFocus(recipeId: string, inputId: InputRecipeFields) {
    this.socket?.emit('input-focus', { recipeId, inputId });
  }

  emitRecipeChanges(recipeId: string, changes: Partial<Recipe>) {
    this.socket?.emit('edit-recipe-field', { recipeId, data: changes });
  }

  listenRecipeChanges(): Observable<{ recipeId: string; data: Partial<Recipe>; message: string }> {
    return new Observable((observer) => {
      this.socket?.on(
        'recipe-field-updated',
        (data: { recipeId: string; data: Partial<Recipe>; message: string }) => {
          observer.next(data);
        },
      );
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
