import {describe, it,expect} from 'vitest';
import authReducer, {register} from '../redux/auth/authReducer';
import type { AuthState } from "../redux/auth/authReducer";

const initialState: AuthState = {
  token: "",
  isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
};

describe ('Auth', () => {
    it('should register user successfully', () => {
        // const userData = {
        //     name:"Nabnoey",
        //     email:"",
        //     phone:"0871565822",
        //     password:"12345678",
        //     confirmPassword:"12345678"
        // }

        const action = {
            type: register.fulfilled.type,
            payload: {
                token: "mocked_token",
        }
        };

        const newState = authReducer(initialState, action);
        expect(newState.isAuthenticated).toBe(true);
        expect(newState.token).toBe("mocked_token");
        
    });


});