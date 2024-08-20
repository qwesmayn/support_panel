import { createAsyncThunk } from "@reduxjs/toolkit";
import { $authHost, $host } from "../../http";
import { IAdminUser } from "../../models/IAdminUser";
import { ITicket } from "../../models/ITicket";
import { IUser } from "../../models/IUser";

// Авторизация

export const adminLogin = createAsyncThunk(
    "adminLogin",
    async (user: { login: string; password: string }, thunkAPI) => {
      try {
        const response = await $host.post<{ token: string }>("/user-admin/login", user);
        localStorage.setItem("token", response.data.token);
      } catch (error : any) {
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
      }
    }
  );
  
  export const userLogin = createAsyncThunk(
    "userLogin",
    async (user: { login: string; password: string }, thunkAPI) => {
      try {
        const response = await $host.post<{ token: string }>("/user/login", user);
        localStorage.setItem("token", response.data.token);
      } catch (error : any) {
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
      }
    }
  );
  

//   Регистрация пользователя

export const userRegister = createAsyncThunk(
    "userRegister",
    async (user: { login: string; password: string; country: string; ip: string; chromeVersion : string; avatar?:string }, thunkAPI) => {
      try {
        const response = await $host.post<{ token: string }>("/user/create", user);
        localStorage.setItem("token", response.data.token);
      } catch (error : any) {
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
      }
    }
  );


  
//   export const getAuth = createAsyncThunk(
//     "getAuth",
//     async (_, thunkAPI) => {
//       try {
//         const response = await $authHost.post<{ token: string }>("user-admin/renew-token");
//         localStorage.setItem("token", response.data.token);
//         return jwtDecode<IUser>(response.data.token);
//       } catch (error: any) {
//         return thunkAPI.rejectWithValue(error.response?.data?.message || 'Authorization failed');
//       }
//     }
//   );


// Получение данных пользователя 

export const getMeAdmin = createAsyncThunk(
    "getMeAdmin",
    async (id : string, thunkAPI) => {
      try {
        const response = await $authHost.get<IAdminUser>(`/user-admin/${id}`);
        return response.data
      } catch (error : any) {
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Get admin info failed');
      }
    }
  );

  export const getMeUser = createAsyncThunk(
    "getMeUser",
    async (id : string, thunkAPI) => {
      try {
        const response = await $authHost.get<IUser>(`/user/${id}`);
        return response.data
      } catch (error : any) {
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Get user info failed');
      }
    }
  );


//  Получение всех тикетов 


export const getAllTickets = createAsyncThunk(
    "getAllTickets",
    async (_, thunkAPI) => {
      try {
        const response = await $authHost.get<ITicket[]>(`/ticket/`);
        return response.data
      } catch (error : any) {
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Get tickets failed');
      }
    }
  );