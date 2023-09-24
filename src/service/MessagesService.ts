import { Observable } from 'rxjs';
import Message from '../model/Message';

export default interface MessagesService {
    addMessage(mes: Message): Promise<Message>;
    getMessages(): Observable<Message[] | string>;
    deleteMessage(id: any): Promise<void>;
    
}
