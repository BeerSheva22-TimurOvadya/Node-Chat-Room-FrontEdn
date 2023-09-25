import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import AuthService from "./AuthService";

export const AUTH_DATA_JWT = 'auth-data-jwt';

function getUserData(data: any): UserData {
    const jwt = data.accessToken;
    localStorage.setItem(AUTH_DATA_JWT, jwt);
    const jwtPayloadJSON = atob(jwt.split('.')[1]);
    const jwtPayloadObj = JSON.parse(jwtPayloadJSON);
    return { email: jwtPayloadObj.sub, role: jwtPayloadObj.roles.includes("ADMIN") ? "admin" : "user" }
}

export default class AuthServiceJwt implements AuthService {
    private ws?: WebSocket;
    
    constructor(private url: string) { }

    async login(loginData: LoginData): Promise<UserData> {
        const serverLoginData: any = {};
        serverLoginData.username = loginData.email;
        serverLoginData.password = loginData.password;
        
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverLoginData)
        });
        
        if (response.ok) {
            const userData = getUserData(await response.json());
            if (userData) {
                this.connectToWebSocket(userData.email); 
            }
            return userData;
        } else {
            return null;
        }
    }
    
    async logout(): Promise<void> {
        if (this.ws) {
            this.ws.close(); 
            console.log('WebSocket is closing...');
        }
        localStorage.removeItem(AUTH_DATA_JWT);
    }

    private connectToWebSocket(username: string): void {
        this.ws = new WebSocket(`ws://localhost:8080/contacts/websocket?clientName=${username}`);
        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
        };
        this.ws.onerror = (error) => {
            console.error(`WebSocket Error: ${error}`);
        };
        
    }
}
