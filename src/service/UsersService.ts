import { Observable } from 'rxjs';
import User from '../model/User';

export default interface UsersService {
    getAllAccounts(): Observable<User[] | string>; 
    deleteUser(username: string): Promise<string>;    
    updateUserStatus(username: string, newStatus: string): Promise<string>
}
