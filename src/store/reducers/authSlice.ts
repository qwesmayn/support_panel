import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminLogin, userLogin, userRegister } from "../action_creators/actionCreators";

export interface userState {
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: userState = {
  isAuth: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminLogin.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
    });
    builder.addCase(
      adminLogin.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      }
    );

    // Авторизация юзера
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(userLogin.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
    });
    builder.addCase(userLogin.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Регистрация юзера
    builder.addCase(userRegister.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(userRegister.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
    });
    builder.addCase(userRegister.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
