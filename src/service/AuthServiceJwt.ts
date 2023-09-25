import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import AuthService from "./AuthService";
import { fetchRequest } from "./httpService";

export const AUTH_DATA_JWT = 'auth-data-jwt';

function getUserData(data: any): UserData {
    const jwt = data.accessToken;
    localStorage.setItem(AUTH_DATA_JWT, jwt);
    const jwtPayloadJSON = atob(jwt.split('.')[1]);
    const jwtPayloadObj = JSON.parse(jwtPayloadJSON);
    return { email: jwtPayloadObj.sub, role: jwtPayloadObj.roles.includes("ADMIN") ? "admin" : "user" };
}

export default class AuthServiceJwt implements AuthService {
    private ws?: WebSocket;
    private urlService: string;
    private urlWebsocket: string;

    constructor(private baseUrl: string) {
        this.urlService = `http://${baseUrl}/users/login`;
        this.urlWebsocket = `ws://${baseUrl}/contacts/websocket?clientName=`;
    }

    async login(loginData: LoginData): Promise<UserData> {
        const serverLoginData = { username: loginData.email, password: loginData.password };
        
        const response = await fetchRequest(this.urlService, { method: 'POST' }, serverLoginData);

        const userData = getUserData(await response.json());
        if (userData) {
            this.connectToWebSocket(userData.email);
        }
        return userData;
    }
    
    async logout(): Promise<void> {
        if (this.ws) {
            this.ws.close(); 
            console.log('WebSocket is closing...');
        }
        localStorage.removeItem(AUTH_DATA_JWT);
    }

    private connectToWebSocket(username: string): void {        
        this.ws = new WebSocket(`${this.urlWebsocket}${username}`);
        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
        };
        this.ws.onerror = (error) => {
            console.error(`WebSocket Error: ${error}`);
        };
        
    }
    reconnect() {
        const jwt = localStorage.getItem(AUTH_DATA_JWT);
        if (jwt) {
            const jwtPayloadJSON = atob(jwt.split('.')[1]);
            const jwtPayloadObj = JSON.parse(jwtPayloadJSON);
            const email = jwtPayloadObj.sub;
            this.connectToWebSocket(email);
        }
    }
}
