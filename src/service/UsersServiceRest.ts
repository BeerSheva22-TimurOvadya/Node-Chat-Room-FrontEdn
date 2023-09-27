import { Observable, Subscriber } from 'rxjs';
import User from '../model/User';
import { AUTH_DATA_JWT } from './AuthServiceJwt';
import UsersService from './UsersService';
import { fetchRequest } from './httpService';




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
    
    
    private subscriberNext(): void {
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
                this.subscriberNext();
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
            const data = JSON.parse(message.data);
            console.log(data);
            this.subscriberNext();
        };
    }
    

    getAccount(username: string): Promise<User | string> {
        return fetchRequest(`${this.urlService}/users/${username}`, { method: 'GET' })
            .then(response => response.json());
    }
   

    async deleteUser(username: string): Promise<string> {
        return fetchRequest(`${this.urlService}/${username}`, { method: 'DELETE' })
            .then(response => `User ${username} has been deleted`);
    }    

   
}
