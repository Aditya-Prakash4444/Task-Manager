import {create} from 'zustand';

interface User{
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState{
    user: User | null;
    token: string| null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,

    login: (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        set({user: userData, token});
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({user: null, token: null});
    },
}));