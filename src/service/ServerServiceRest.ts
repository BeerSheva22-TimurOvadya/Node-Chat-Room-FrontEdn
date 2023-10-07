import { Observable, Subscriber } from 'rxjs';
import User from '../model/User';
import Message from '../model/Message';
import { fetchRequest } from './httpService';
import ServerService from './ServerService';
import { AUTH_DATA_JWT } from './AuthServiceJwt';
const AUTH_ITEM = "auth-item";

export let sharedWebSocket: WebSocket | null = null;

export default class ServerServiceRest implements ServerService {
    private observableUsers: Observable<User[] | string> | null = null;
    private observableMessages: Observable<Message[] | string> | null = null;
    private subscriberUsers: Subscriber<string | User[]> | undefined;
    private subscriberMessages: Subscriber<string | Message[]> | undefined;
    private baseUrl: string;
    private urlUsersService: string;
    private urlMessagesService: string;
    private urlWebsocket: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.urlUsersService = `http://localhost:8080/users`;
        this.urlMessagesService = `http://localhost:8080/messages`;
        this.urlWebsocket = `ws://localhost:8080/users/websocket/`;
    }

    private subscriberNextUsers(): void {
        this.fetchAllUsers(this.urlUsersService)
            .then((users) => {
                this.subscriberUsers?.next(users);
            })
            .catch((error) => this.subscriberUsers?.next(error));
    }

    private subscriberNextMessages(): void {
        this.fetchAllMessages(this.urlMessagesService)
            .then((messages) => {
                this.subscriberMessages?.next(messages);
            })
            .catch((error) => this.subscriberMessages?.next(error));
    }

    private async connectWS(clientName?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = clientName ? `${this.urlWebsocket}${clientName}` : this.urlWebsocket;
    
            sharedWebSocket = new WebSocket(
                url + JSON.parse(localStorage.getItem(AUTH_ITEM) || '').email,
                localStorage.getItem(AUTH_DATA_JWT) || '',
            );
            sharedWebSocket.onopen = () => {
                // console.log('Connected to WebSocket');
                resolve();
            };
            sharedWebSocket.onerror = (error) => {
                console.error(`WebSocket Error: ${error}`);
                reject(error);
            };
            sharedWebSocket.onmessage = (message) => {
                // console.log(message.data);
                this.subscriberNextUsers();
                this.subscriberNextMessages();
            };
        });
    }
    
    async sendMessage(empl: Message): Promise<Message> {
        const from = JSON.parse(localStorage.getItem(AUTH_ITEM) || '').email;
    
        if (sharedWebSocket && sharedWebSocket.readyState === WebSocket.OPEN) {
            sharedWebSocket.send(JSON.stringify({ from, to: empl.to, text: empl.text }));
        } else {
            await this.connectWS(empl.to);
            sharedWebSocket?.send(JSON.stringify({ from, to: empl.to, text: empl.text }));
        }
        return Promise.resolve(empl);
    }

    getAllAccounts(): Observable<User[] | string> {
        if (!this.observableUsers) {
            this.observableUsers = new Observable<User[] | string>((subscriber) => {
                this.subscriberUsers = subscriber;
                this.subscriberNextUsers();
                this.connectWS();
            });
        }
        return this.observableUsers;
    }

    getMessages(): Observable<Message[] | string> {
        if (!this.observableMessages) {
            this.observableMessages = new Observable<Message[] | string>((subscriber) => {
                this.subscriberMessages = subscriber;
                this.subscriberNextMessages();
                this.connectWS();
            });
        }
        return this.observableMessages;
    }

    async deleteUser(username: string): Promise<string> {
        return fetchRequest(`${this.urlUsersService}/${username}`, { method: 'DELETE' }).then(
            (response) => `User ${username} has been deleted`,
        );
    }

    async updateUserStatus(username: string, newStatus: string): Promise<string> {
        return fetchRequest(`${this.urlUsersService}/${username}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => `User ${username} status was changed to ${newStatus}`);
    }

    async deleteMessage(id: any): Promise<void> {
        await fetchRequest(`${this.urlMessagesService}/${id}`, { method: 'DELETE' });
    }

   

    async markAsRead(sender: string): Promise<void> {
        await fetchRequest(`${this.urlMessagesService}/mark-as-read/${sender}`, { method: 'PUT' });
    }

    async getUserStatus(username: string): Promise<string> {
        const response = await fetchRequest(`${this.urlUsersService}/${username}/status`, {});
        const data = await response.json();
        return data.status;
    }

    

    private async fetchAllUsers(url: string): Promise<User[] | string> {
        const response = await fetchRequest(url, {});
        return await response.json();
    }

    private async fetchAllMessages(url: string): Promise<Message[] | string> {
        const response = await fetchRequest(url, {});
        return await response.json();
    }
}
