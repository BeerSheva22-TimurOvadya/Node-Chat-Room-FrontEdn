import { Observable, Subscriber } from 'rxjs';
import Message from '../model/Message';
import { AUTH_DATA_JWT } from './AuthServiceJwt';
import MessagesService from './MessagesService';
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
async function fetchRequest(url: string, options: RequestInit, empl?: Message): Promise<Response> {
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
        this.urlService = `http://${baseUrl}`;
        this.urlWebsocket = `ws://${baseUrl}/websocket`;
    }
    async updateMessage(empl: Message): Promise<Message> {
        const response = await fetchRequest(this.getUrlWithId(empl.id!), { method: 'PUT' }, empl);
        return await response.json();
    }
    private getUrlWithId(id: any): string {
        return `${this.urlService}/${id}`;
    }
    private sibscriberNext(): void {
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

    async addMessage(empl: Message): Promise<Message> {
        if (empl.id == 0) {
            delete empl.id;
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
