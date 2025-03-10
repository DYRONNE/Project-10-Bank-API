import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userDetails: null, // Détails de l'utilisateur, comme le nom, l'email, etc.
  token: localStorage.getItem('token') || null, // Récupère le token stocké dans localStorage (si disponible)
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userDetails = action.payload.userDetails;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Sauvegarde le token dans localStorage
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userDetails = null;
      state.token = null;
      localStorage.removeItem('token'); // Supprime le token lors de la déconnexion
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
