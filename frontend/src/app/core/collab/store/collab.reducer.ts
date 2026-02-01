import { createReducer, on } from '@ngrx/store';
import * as collabActions from './collab.action';
import { initialCollabState } from '../models/collab.state';

export const collabReducer = createReducer(
  initialCollabState,
  on(collabActions.connect, (state) => {
    console.log('Collab Reducer: connect action triggered');
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(collabActions.connectSuccess, (state) => {
    return {
      ...state,
      isConnected: true,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.connectFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(collabActions.disconnect, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(collabActions.disconnectSuccess, (state) => {
    return {
      ...initialCollabState,
    };
  }),
  on(collabActions.disconnectFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(collabActions.joinRoom, (state, {recipeId}) => {
    return {
      ...state,
      currentRecipeId: recipeId,
      isLoading: true,
      error: null,
    };
  }),
  on(collabActions.joinRoomSuccess, (state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.joinRoomFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(collabActions.userJoinedRoomSuccess, (state, { recipeId, users }) => {
    console.log('Collab Reducer: userJoinedRoomSuccess action triggered', users);
    return {
      ...state,
      currentRecipeId: recipeId,
      usersInRoom: users,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.leaveRoom, (state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(collabActions.leaveRoomSuccess, (state) => {
    return {
      ...state,
      currentRecipeId: null,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.leaveRoomFailure, (state, { error }) => {
    return {
      ...state,
      isLoading: false,
      error,
    };
  }),
  on(collabActions.setUsersInRoom, (state, { recipeId, users }) => {
    return {
      ...state,
      currentRecipeId: recipeId,
      usersInRoom: users,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.setRecipeToEdit, (state, { recipe }) => {
    return {
      ...state,
      recipeToEdit: recipe,
    };
  }),
  on(collabActions.recipeChanged, (state, { recipeId, changes }) => {
    // console.log('Collab Reducer: recipeChanged action triggered', changes);
    return {
      ...state,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.recipeChangeReceived, (state, { recipeId, data, message }) => {
    if (!state.recipeToEdit) return state;
    console.log('Collab Reducer: recipeChangeReceived action triggered', message, data);
    const newRecipeData = { ...state.recipeToEdit, ...data };
    return {
      ...state,
      recipeToEdit: newRecipeData,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.setInputFocus, (state, { recipeId, inputId }) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(collabActions.setInputFocusSuccess, (state, { recipeId, inputsOccupied }) => {
    return {
      ...state,
      inputsOccupied,
      isLoading: false,
      error: null,
    };
  }),
  on(collabActions.setInputFocusFailure, (state, { recipeId, inputsOccupied, message }) => {
    return {
      ...state,
      inputsOccupied,
      isLoading: false,
      error: message,
    };
  }),
  on(collabActions.setInputBlur, (state, { recipeId, inputId }) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),
  on(collabActions.setInputBlurSuccess, (state, { recipeId, inputsOccupied }) => {
    return {
      ...state,
      inputsOccupied,
      isLoading: false,
      error: null,
    };
  }),
);
