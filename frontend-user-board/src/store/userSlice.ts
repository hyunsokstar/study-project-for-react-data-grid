// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isLoggedIn: boolean;
    loginUser: {
        id: number;
        email: string;
        nickname: string;
    };
}

const initialState: UserState = {
    isLoggedIn: false,
    loginUser: {
        id: 0,
        email: '',
        nickname: '',
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoginUser: (state, action: PayloadAction<{ id: number, email: string; nickname: string }>) => {
            const { id, email, nickname } = action.payload;
            state.loginUser = {
                id,
                email,
                nickname,
            };
            state.isLoggedIn = true; // 로그인 상태 변경
        },
        logoutUser: (state) => {
            state.isLoggedIn = false; // 로그아웃 상태 변경
            state.loginUser = {
                id: 0,
                email: '',
                nickname: '',
            }; // 로그아웃 시 유저 정보 초기화
        },
        // 다른 액션들도 추가 가능
    },
});

export const { setLoginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;