import LoginData from "../model/LoginData";
import UserData from "../model/UserData";

export default interface AuthService {
    login(loginData: LoginData):Promise<UserData>;
    logout():Promise<void>
}