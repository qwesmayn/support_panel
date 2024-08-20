import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdminUser } from "../../models/IAdminUser";
import { getMeAdmin, getMeUser } from "../action_creators/actionCreators";
import { IUser } from "../../models/IUser";

export interface userState {
  user: IAdminUser| IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: userState = {
  user: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Получение данных пользователя
    builder.addCase(getMeAdmin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getMeAdmin.fulfilled, (state, action: PayloadAction<IAdminUser>) => {
      state.isLoading = false;
      state.user = action.payload
      state.error = null;
    });
    builder.addCase(getMeAdmin.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getMeUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(getMeUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.user = action.payload
        state.error = null;
      });
      builder.addCase(getMeUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
