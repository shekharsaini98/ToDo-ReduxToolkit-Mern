import { createAsyncThunk, createSlice, isFulfilled } from "@reduxjs/toolkit";
import {fetch2, fetch3} from '../helpers/fetch2';
const initialState = [];

export const createTodo = createAsyncThunk(
    'createtodo',
    async (body)=>{
        const response = await fetch2('/createtodo', body);
        return response;
    }
)
export const getTodo = createAsyncThunk(
    'gettodo',
    async ()=>{
        const response = await fetch3('/gettodos', 'get');
        return response;
    }
)
export const deleteTodo = createAsyncThunk(
    'deletetodo',
    async (id)=>{
        const response = await fetch3(`/remove/${id}`, 'delete');
        return response;
    }
)
const todoReducer = createSlice({
    name:'todo',
    initialState,
    reducers:{},
    extraReducers:{
        [createTodo.fulfilled]:(state,{payload:{message}})=>{
            if(message) state.push(message);
        },
        [getTodo.fulfilled]:(state,{payload:{message}})=>{
            return message
        },
        [deleteTodo.fulfilled]:(state,{payload:{message}})=>{
            return state.filter(item=>item._id !== message._id)
        }
    }
});

export default todoReducer.reducer;