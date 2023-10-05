import { Observable } from 'rxjs';
import User from '../model/User';
import Message from '../model/Message';

export default interface ServerService {
    getAllAccounts(): Observable<User[] | string> ;
    deleteUser(username: string): Promise<string>;
    updateUserStatus(username: string, newStatus: string): Promise<string>;
    
    getMessages(): Observable<Message[] | string>  
    deleteMessage(id: any): Promise<void>;
    sendMessage(message: Message): void;
    markAsRead(sender: string): Promise<void>;
}
