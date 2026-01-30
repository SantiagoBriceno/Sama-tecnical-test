import { AppState } from "../../../app.state";

export const selectCollabState = (state: AppState) => state.collab;

export const selectIsConnected = (state: AppState) => state.collab.isConnected;
export const selectCurrentRecipeId = (state: AppState) => state.collab.currentRecipeId;
export const selectUsersInRoom = (state: AppState) => state.collab.usersInRoom;
export const selectCollabIsLoading = (state: AppState) => state.collab.isLoading;
export const selectCollabError = (state: AppState) => state.collab.error;
export const selectRecipeToEdit = (state: AppState) => state.collab.recipeToEdit;
