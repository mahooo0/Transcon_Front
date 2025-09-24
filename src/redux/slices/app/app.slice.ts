import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  formLang: 'ru',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFormLang: (state, action: PayloadAction<'ru' | 'pl'>) => {
      state.formLang = action.payload;
    },
  },
});

export const { setFormLang } = appSlice.actions;

export default appSlice.reducer;
