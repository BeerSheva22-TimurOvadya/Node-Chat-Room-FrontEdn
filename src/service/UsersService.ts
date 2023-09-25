import { Observable } from 'rxjs';
import User from '../model/User';

export default interface UsersService {
    getAllAccounts(): Observable<User[] | string>;    
    getAccount(username: string): Promise<User | string>;    
    deleteUser(username: string): Promise<string>;    
}
