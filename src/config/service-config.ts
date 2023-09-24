import AuthService from '../service/AuthService';
import AuthServiceJwt from '../service/AuthServiceJwt';
import MessagesService from '../service/MessagesService';
import MessagesServiceRest from '../service/MessagesServiceRest';

export const authService: AuthService = new AuthServiceJwt('http://localhost:8080/users/login');
export const messagesService: MessagesService = new MessagesServiceRest('localhost:8080/messages');
