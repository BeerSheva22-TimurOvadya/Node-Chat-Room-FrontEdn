import { Observable } from 'rxjs';
import User from '../model/User';

export default interface UsersService {
    getAllAccounts(): Observable<User[] | string>;
    addAccount(user: User): Promise<User | string>;
    getAccount(username: string): Promise<User | string>;
    login(user: User): Promise<string | null>;
    deleteUser(username: string): Promise<string>;
    updateUserStatus(username: string, status: string): Promise<string>;
}
