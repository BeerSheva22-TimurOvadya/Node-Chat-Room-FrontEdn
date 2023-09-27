import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { useSelector } from "react-redux";
import UserData from "../model/UserData";
import { codeReducer } from "./slices/codeSlice";
import CodeType from "../model/CodeType";
import CodePayload from "../model/CodePayload";
import updateUser from "./updateUser";

export const store = configureStore({
    reducer: {
     authState: authReducer,
     codeState: codeReducer
    } ,   
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(updateUser),
});
export function useSelectorAuth() {
    return useSelector<any, UserData>(state => state.authState.userData);
}
export function useSelectorCode() {
    return useSelector<any, CodePayload>(state => state.codeState.codeMessage);
}


