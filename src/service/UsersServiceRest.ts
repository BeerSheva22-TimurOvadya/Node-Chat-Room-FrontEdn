import { Observable, Subscriber } from 'rxjs';
import User from '../model/User';
import { AUTH_DATA_JWT } from './AuthServiceJwt';
import UsersService from './UsersService';



async function getResponseText(response: Response): Promise<string> {
    let res = '';
    if (!response.ok) {
        const { status } = response;
        res = status == 401 || status == 403 ? 'Authentication' : await response.text();
    }
    return res;
}
function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`,
    };
    return res;
}
async function fetchRequest(url: string, options: RequestInit, empl?: User): Promise<Response> {
    options.headers = getHeaders();
    if (empl) {
        options.body = JSON.stringify(empl);
    }

    let flUpdate = true;
    let responseText = '';
    try {
        if (options.method == 'DELETE' || options.method == 'PUT') {
            flUpdate = false;
            await fetchRequest(url, { method: 'GET' });
            flUpdate = true;
        }

        const response = await fetch(url, options);
        responseText = await getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        if (!flUpdate) {
            throw error;
        }
        throw responseText ? responseText : 'Server is unavailable. Repeat later on';
    }
}
async function fetchAllUsers(url: string): Promise<User[] | string> {
    const response = await fetchRequest(url, {});    
    return await response.json();
}

export default class UsersServiceRest implements UsersService {
    private observable: Observable<User[] | string> | null = null;
    private subscriber: Subscriber<string | User[]> | undefined;
    private urlService: string;
    private urlWebsocket: string;
    private webSocket: WebSocket | undefined;

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}`;
        this.urlWebsocket = `ws://${baseUrl}/websocket`;
    }
    
    
    private sibscriberNext(): void {
        fetchAllUsers(this.urlService)
            .then((users) => {
                this.subscriber?.next(users);
            })
            .catch((error) => this.subscriber?.next(error));
    }
    
    getAllAccounts(): Observable<User[] | string> {
        if (!this.observable) {
            this.observable = new Observable<User[] | string>((subscriber) => {
                this.subscriber = subscriber;
                this.sibscriberNext();
                this.connectWS();
                return () => this.disconnectWS();
            });
        }
        return this.observable;
    }
    private disconnectWS(): void {
        this.webSocket?.close();
    }
    private connectWS() {
        this.webSocket = new WebSocket(this.urlWebsocket, localStorage.getItem(AUTH_DATA_JWT) || '');

        this.webSocket.onmessage = (message) => {
            console.log(message.data);
            this.sibscriberNext();
        };
    }
    addAccount(user: User): Promise<User | string> {
        return fetchRequest(`${this.urlService}/users`, {
            method: 'POST',
            body: JSON.stringify(user),
        }).then(response => response.json());
    }

    getAccount(username: string): Promise<User | string> {
        return fetchRequest(`${this.urlService}/users/${username}`, { method: 'GET' })
            .then(response => response.json());
    }

    login(user: User): Promise<string | null> {
        return fetchRequest(`${this.urlService}/users/login`, {
            method: 'POST',
            body: JSON.stringify(user),
        }).then(response => response.json().then(data => data.accessToken));
    }

    deleteUser(username: string): Promise<string> {
        return fetchRequest(`${this.urlService}/users/${username}`, { method: 'DELETE' })
            .then(response => `User ${username} has been deleted`);
    }

    updateUserStatus(username: string, status: string): Promise<string> {
        return fetchRequest(`${this.urlService}/users/${username}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }).then(response => `User ${username} status was changed to ${status}`);
    }

   
}
