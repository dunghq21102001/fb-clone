import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserSlice {
    id: string,
    username: string,
    image: string,
    fullname: string
}


const initialState: UserSlice = JSON.parse(localStorage.getItem('auth')) || { username: '', image: '', fullname: '' }
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<UserSlice>) => {
            state.id = action.payload.id
            state.fullname = action.payload.fullname
            state.username = action.payload.username
            state.image = action.payload.image
        },
    }
})

export const { addUser } = userSlice.actions

export default userSlice.reducer