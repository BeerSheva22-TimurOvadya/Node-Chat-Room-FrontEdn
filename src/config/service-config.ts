
import AuthService from '../service/AuthService';
import AuthServiceJwt from '../service/AuthServiceJwt';
import ServerService from '../service/ServerService';
import ServerServiceRest from '../service/ServerServiceRest';



export const authService: AuthService = new AuthServiceJwt('http://localhost:8080/users');

export const serverService: ServerService = new ServerServiceRest('localhost:8080')
