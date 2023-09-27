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
    private userEmail: string;

    constructor(baseUrl: string, userEmail: string) {
        this.urlService = `http://${baseUrl}/messages`;
        this.urlWebsocket = `ws://${baseUrl}/users/websocket`;
        this.userEmail = userEmail;
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

    // private connectWS() {
    //     this.webSocket = new WebSocket(this.urlWebsocket, localStorage.getItem(AUTH_DATA_JWT) || '');        
    //     this.webSocket.onmessage = (message) => {            
    //         const data = JSON.parse(message.data);
    //         console.log(data);
    //         this.subscriberNext();
    //     };
    // }

    private connectWS() {    
        
        
        this.webSocket = new WebSocket(`${this.urlWebsocket}?clientName=${this.userEmail}`);
            
        this.webSocket.onmessage = (message) => {            
            const data = JSON.parse(message.data);
            console.log(data);
            this.subscriberNext();
        };
    }

    async deleteMessage(id: any): Promise<void> {
        await fetchRequest(this.getUrlWithId(id), {
            method: 'DELETE',
        });
    }

    setUserEmail(email: string): void {
        this.userEmail = email;
    }

    async sendMessage(empl: Message): Promise<Message> {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            
            this.webSocket.send(JSON.stringify({ to: empl.to, text: empl.text }));
        } 
        else {
            
            this.connectWS();
            if (this.webSocket) {
                this.webSocket.onopen = () => {
                    this.webSocket?.send(JSON.stringify({ to: empl.to, text: empl.text }));
                };
            }
        }
        
        return Promise.resolve(empl);
    }
    
}
