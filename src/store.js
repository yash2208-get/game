import { configureStore, createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { activeView: 'Overview', mobileMenuOpen: false, notificationsOpen: false },
  reducers: {
    setActiveView: (state, action) => { state.activeView = action.payload; state.mobileMenuOpen = false; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    toggleNotifications: (state) => { state.notificationsOpen = !state.notificationsOpen; }
  }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState: { balance: 2840.50, winning: 2140.50, bonus: 700.00 },
  reducers: {
    addFunds: (state, action) => { state.balance += action.payload; state.winning += action.payload; }
  }
});

export const { setActiveView, toggleMobileMenu, toggleNotifications } = uiSlice.actions;
export const { addFunds } = walletSlice.actions;
export const store = configureStore({ reducer: { ui: uiSlice.reducer, wallet: walletSlice.reducer } });
