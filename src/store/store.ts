import ticketReducer from './reducers/ticketSlice';
import userReducer from './reducers/userSlice';
import  authReducer  from './reducers/authSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit'


const rootReducer = combineReducers({
  authReducer,
  userReducer,
  ticketReducer
})

export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch