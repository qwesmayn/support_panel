import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllTickets } from "../action_creators/actionCreators";
import { ITicket } from "../../models/ITicket";

export interface userState {
  tickets: ITicket[] | null;
  isLoadingT: boolean;
  error: string | null;
}

const initialState: userState = {
  tickets: null,
  isLoadingT: false,
  error: null,
};

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTickets.pending, (state) => {
      state.isLoadingT = true;
      state.error = null;
    });
    builder.addCase(getAllTickets.fulfilled, (state, action: PayloadAction<ITicket[]>) => {
      state.isLoadingT = false;
      state.tickets = action.payload
      state.error = null;
    });
    builder.addCase(getAllTickets.rejected, (state, action: PayloadAction<any>) => {
      state.isLoadingT = false;
      state.error = action.payload as string;
    });
  },
});

export default ticketSlice.reducer;