import LoginData from '../model/LoginData';
import UserData from '../model/UserData';
import AuthService from './AuthService';
import { fetchRequest } from './httpService';

export const AUTH_DATA_JWT = 'auth-data-jwt';

function extractJwtPayload(jwt: string) {
    const jwtPayloadJSON = atob(jwt.split('.')[1]);
    return JSON.parse(jwtPayloadJSON);
}

function getUserData(data: any): UserData {
    const jwt = data.accessToken;
    localStorage.setItem(AUTH_DATA_JWT, jwt);
    const jwtPayloadObj = extractJwtPayload(jwt);
    return { email: jwtPayloadObj.sub, role: jwtPayloadObj.roles.includes('ADMIN') ? 'admin' : 'user' };
}

export let sharedWebSocket: WebSocket | null = null;

export default class AuthServiceJwt implements AuthService {
    private urlService: string;
    private urlWebsocket: string;

    constructor(private baseUrl: string) {
        this.urlService = `http://${baseUrl}/login`;
        this.urlWebsocket = `ws://${baseUrl}/websocket?clientName=`;
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

    async register(loginData: LoginData): Promise<UserData> {
        const urlRegisterService = `http://${this.baseUrl}`;
        const serverRegisterData = {
            username: loginData.email,
            password: loginData.password,
        };

        try {
            const response = await fetchRequest(
                urlRegisterService,
                { method: 'POST' },
                serverRegisterData,
            );
            if (response.status !== 201) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error during registration');
            }
            const userData = getUserData(await response.json());
            if (userData) {
                this.connectToWebSocket(userData.email);
            }

            return userData;
        } catch (error: any) {
            throw new Error(error.message || 'Unknown error during registration');
        }
    }

    async logout(): Promise<void> {
        if (sharedWebSocket) {
            sharedWebSocket.close();
            console.log('WebSocket is closing...');
            sharedWebSocket = null;
        }
        localStorage.removeItem(AUTH_DATA_JWT);
    }

    private connectToWebSocket(username: string): void {
        sharedWebSocket = new WebSocket(`${this.urlWebsocket}${username}`);
        sharedWebSocket.onopen = () => {
            console.log('Connected to WebSocket');
        };
        sharedWebSocket.onerror = (error) => {
            console.error(`WebSocket Error: ${error}`);
        };
    }

    reconnect() {
        const jwt = localStorage.getItem(AUTH_DATA_JWT);
        if (jwt) {
            const jwtPayloadObj = extractJwtPayload(jwt);
            this.connectToWebSocket(jwtPayloadObj.sub);
        }
    }
}
