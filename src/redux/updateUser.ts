import { messagesService } from '../config/service-config';

const updateUser =
    (store: { getState: () => any }) =>
    (next: (arg0: any) => any) =>
    (action: { type: string | string[] }) => {
        
        let result = next(action);

        
        const nextState = store.getState();
        if (action.type.includes('authState')) {
            const userEmail = nextState.authState.userData?.email || '';
            messagesService.setUserEmail(userEmail); 
        }

        
        return result;
    };

export default updateUser;
