import { Observable, Subscriber } from 'rxjs';
import User from '../model/User';
import { sharedWebSocket } from './AuthServiceJwt';
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

    constructor(baseUrl: string) {
        this.urlService = `${baseUrl}`;
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

    async deleteUser(username: string): Promise<string> {
        return fetchRequest(`${this.urlService}/${username}`, { method: 'DELETE' }).then(
            (response) => `User ${username} has been deleted`,
        );
    }
}
