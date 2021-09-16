import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetch2} from '../helpers/fetch2';
const initialState = {
    token:"",
    loading:false,
    error:""
}

export const signupUser = createAsyncThunk(
    'signupUser',
    async (body)=>{
        const response = await fetch2('/signup', body);
        return response
    }
)
export const signinUser = createAsyncThunk(
    'signinUser',
    async (body)=>{
        const response = await fetch2('/signin', body);
        return response
    }
)

const authReducer = createSlice({
    name:"user",
    initialState,
    reducers:{
        addToken: (state, action)=>{
            state.token = localStorage.getItem('token');
        },
        logout: (state, action)=>{
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: {
        [signupUser.fulfilled]:(state, {payload:{error,message}})=>{
            state.loading = false;
            if(error){
                state.error = error;
            }
            else{
                state.error = message;        
            }
        },
        [signupUser.pending]:(state, action)=>{
            state.loading = true;
        },
        [signinUser.fulfilled]:(state, {payload:{error,token}})=>{
            state.loading = false;
            if(error){
                state.error = error;
            }
            else{
                state.token = token; 
                state.error = 'Login Success! Welcome Back';
                localStorage.setItem('token', token);      
            }
        },
        [signinUser.pending]:(state, action)=>{
            state.loading = true;
        }
    }
})

export const {addToken, logout} = authReducer.actions;
export default authReducer.reducer;