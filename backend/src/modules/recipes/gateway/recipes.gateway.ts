import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from 'src/modules/auth/guards/wsAuth.guard';
import type { authenticatedClient } from 'src/shared/types/gateway';
import { InputRecipeFields } from '../types/recipes';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { RecipesService } from '../services/recipes.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RecipesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly recipeService: RecipesService,
  ) {}

  handleConnection(client: authenticatedClient) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];

      if (!token) throw new Error('Connection rejected: No token provided');

      client.emit(
        'connection',
        'Successfully connected to the Recipes WebSocket Gateway',
      );
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: authenticatedClient) {
    console.log(`Client disconnected: ${client.id}`);
    // verificamos si el cliente estaba unido a alguna sala y lo removemos de ella
    if (client.rooms) {
      client.rooms.forEach((room) => {
        if (room.startsWith('recipe-')) {
          client.leave(room);
          console.log(`Client ${client.id} left room ${room}`);
        }
      });
    }
  }

  // Mensaje para indicar que un usuario está viendo una receta
  @UseGuards(WsGuard)
  @SubscribeMessage('viewing-recipe')
  async HandleViewRecipe(
    @MessageBody() data: { recipeId: string },
    @ConnectedSocket() client: authenticatedClient,
  ) {
    //
    const recipeRoom = `recipe-${data.recipeId}`;
    const { user } = client;
    console.log(`User ${user.username} is viewing recipe ${data.recipeId}`);

    // Unimos al usuario a la sala de la receta
    client.join(recipeRoom);

    // Notificamos a todos los usuarios en la sala sobre el nuevo usuario

    const activedUsers = await this.getUsersViewingRecipe(data.recipeId);

    this.server.to(recipeRoom).emit('recipe-new-user', {
      recipeId: data.recipeId,
      message: 'Un nuevo usuario está viendo esta receta',
      users: activedUsers,
    });

    console.log('mensaje enviado a la sala:', recipeRoom);

    return {
      status: 'joined',
      room: recipeRoom,
    };
  }

  // Mensaje para indicar que un usuario ha dejado de ver una receta
  @UseGuards(WsGuard)
  @SubscribeMessage('stop-viewing-recipe')
  async HandleStopViewRecipe(
    @MessageBody() data: { recipeId: string },
    @ConnectedSocket() client: authenticatedClient,
  ) {
    const recipeRoom = `recipe-${data.recipeId}`;
    const { user } = client;
    console.log(
      `User ${user.username} stopped viewing recipe ${data.recipeId}`,
    );
    // Sacamos al usuario de la sala de la receta
    client.leave(recipeRoom);
    // Notificamos a todos los usuarios en la sala sobre el usuario que se fue
    const activedUsers = await this.getUsersViewingRecipe(data.recipeId);
    this.server.to(recipeRoom).emit('recipe-user-left', {
      recipeId: data.recipeId,
      message: 'Un usuario ha dejado de ver esta receta',
      users: activedUsers,
    });
    console.log('mensaje enviado a la sala:', recipeRoom);
    return {
      status: 'left',
      room: recipeRoom,
    };
  }

  // Mensaje para indicar que un usuario hizo focus en un input de la receta IMPLEMENTAR EN FUTURAS MEJORAS
  @UseGuards(WsGuard)
  @SubscribeMessage('input-focus')
  async HandleInputFocus(
    @MessageBody() data: { recipeId: string; inputId: InputRecipeFields },
    @ConnectedSocket() client: authenticatedClient,
  ) {
    const recipeRoom = `recipe-${data.recipeId}`;
    const { user } = client;
    // Notificamos a todos los usuarios en la sala sobre el usuario que hizo focus
    this.server.to(recipeRoom).emit('recipe-input-focus', {
      recipeId: data.recipeId,
      inputId: data.inputId,
      message: `El usuario ${user.username} está editando este campo`,
    });
    console.log('mensaje enviado a la sala:', recipeRoom);
    return {
      status: 'input-focused',
      room: recipeRoom,
    };
  }

  // Mensaje para indicar que un usuario hizo blur en un input de la receta IMPLEMENTAR EN FUTURAS MEJORAS

  // Mensaje para notificar la edición de los campos de la receta IMPLEMENTAR EN FUTURAS MEJORAS
  @UseGuards(WsGuard)
  @SubscribeMessage('edit-recipe-field')
  async HandleEditRecipeField(
    @MessageBody()
    data: {
      recipeId: string;
      data: Partial<CreateRecipeDto>;
    },
    @ConnectedSocket() client: authenticatedClient,
  ) {
    const recipeRoom = `recipe-${data.recipeId}`;
    const { user } = client;
    // Notificamos a todos los usuarios menos al que editó en la sala sobre el usuario que editó un campo

    this.server
      .to(recipeRoom)
      .emit('recipe-field-updated', {
        recipeId: data.recipeId,
        data: data.data,
        message: `El usuario ${user.username} ha editado la receta`,
      });

    this.recipeService.updateRecipe(data.recipeId, data.data, user.sub);
    return {
      status: 'field-updated',
      room: recipeRoom,
    };
  }

  private async getUsersViewingRecipe(recipeId: string) {
    const sockets = await this.server.in(`recipe-${recipeId}`).fetchSockets();

    const activeUsers = sockets.map((socket) => socket['user'].username);

    const uniqueActiveUsers = activeUsers.filter((value, index, self) => self.indexOf(value) === index);

    console.log(`Users viewing recipe ${recipeId}:`, uniqueActiveUsers);
    return uniqueActiveUsers;
  }
}
