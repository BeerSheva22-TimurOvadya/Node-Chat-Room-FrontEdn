import { Observable, Subscriber } from 'rxjs';
import Message from '../model/Message';
import { AUTH_DATA_JWT } from './AuthServiceJwt';
import MessagesService from './MessagesService';
import { fetchRequest } from './httpService';


async function fetchAllMessages(url: string): Promise<Message[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json();
}

export default class MessagesServiceRest implements MessagesService {
    private observable: Observable<Message[] | string> | null = null;
    private subscriber: Subscriber<string | Message[]> | undefined;
    private urlService: string;
    private urlWebsocket: string;
    private webSocket: WebSocket | undefined;
    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}/messages`;
        this.urlWebsocket = `ws://${baseUrl}/users/websocket`;
    }
    
    private getUrlWithId(id: any): string {
        return `${this.urlService}/${id}`;
    }
    private subscriberNext(): void {
        fetchAllMessages(this.urlService)
            .then((messages) => {
                this.subscriber?.next(messages);
            })
            .catch((error) => this.subscriber?.next(error));
    }
    async deleteMessage(id: any): Promise<void> {
        await fetchRequest(this.getUrlWithId(id), {
            method: 'DELETE',
        });
    }
    getMessages(): Observable<Message[] | string> {
        if (!this.observable) {
            this.observable = new Observable<Message[] | string>((subscriber) => {
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

    async addMessage(empl: Message): Promise<Message> {
        if (empl._id === 0) {
            delete empl._id;
        }
        const response = await fetchRequest(
            this.urlService,
            {
                method: 'POST',
            },
            empl,
        );
        return response.json();
    }
}
