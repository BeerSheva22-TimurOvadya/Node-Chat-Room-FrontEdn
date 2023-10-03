import { Observable, Subscriber } from 'rxjs';
import Message from '../model/Message';
import MessagesService from './MessagesService';
import { fetchRequest } from './httpService';
import { sharedWebSocket } from './AuthServiceJwt';

async function fetchAllMessages(url: string): Promise<Message[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json();
}

export default class MessagesServiceRest implements MessagesService {
    private observable: Observable<Message[] | string> | null = null;
    private subscriber: Subscriber<string | Message[]> | undefined;
    private urlService: string;

    constructor(baseUrl: string) {
        this.urlService = `${baseUrl}`;
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
            });
        }
        return this.observable;
    }

    private connectWS() {
        if (sharedWebSocket) {
            sharedWebSocket.onmessage = (message) => {
                const data = JSON.parse(message.data);
                console.log(data);
                this.subscriberNext();
            };
        }
    }

    async deleteMessage(id: any): Promise<void> {
        await fetchRequest(this.getUrlWithId(id), {
            method: 'DELETE',
        });
    }

    async sendMessage(empl: Message): Promise<Message> {
        if (sharedWebSocket && sharedWebSocket.readyState === WebSocket.OPEN) {
            sharedWebSocket.send(JSON.stringify({ to: empl.to, text: empl.text }));
        } else {
            this.connectWS();
            if (sharedWebSocket) {
                sharedWebSocket.onopen = () => {
                    sharedWebSocket?.send(JSON.stringify({ to: empl.to, text: empl.text }));
                };
            }
        }
        return Promise.resolve(empl);
    }
}
