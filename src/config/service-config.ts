
import AuthService from '../service/AuthService';
import AuthServiceJwt from '../service/AuthServiceJwt';
import MessagesService from '../service/MessagesService';
import MessagesServiceRest from '../service/MessagesServiceRest';
import UsersService from '../service/UsersService';
import UsersServiceRest from '../service/UsersServiceRest';

import { store } from '../redux/store'; 

const userEmail = store.getState().authState.userData?.email || "";

export const authService: AuthService = new AuthServiceJwt('localhost:8080');
export const messagesService: MessagesService = new MessagesServiceRest('localhost:8080', userEmail);
export const usersService: UsersService = new UsersServiceRest('localhost:8080/users');
