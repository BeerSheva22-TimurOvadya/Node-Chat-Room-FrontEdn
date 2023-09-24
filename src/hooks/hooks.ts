import { useDispatch } from 'react-redux';
import CodePayload from '../model/CodePayload';
import CodeType from '../model/CodeType';
import { codeActions } from '../redux/slices/codeSlice';
import { useEffect, useState } from 'react';
import Message from '../model/Message';
import { Subscription } from 'rxjs';
import { messagesService } from '../config/service-config';

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';

        if (error.includes('Authentication')) {
            code = CodeType.AUTH_ERROR;
            message = 'Authentication error, mooving to Sign In';
        } else {
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
            message = error;
        }
        dispatch(codeActions.set({ code, message: message || successMessage }));
    };
}
export function useSelectorMessages() {
    const dispatch = useDispatchCode();
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        const subscription: Subscription = messagesService.getMessages().subscribe({
            next(emplArray: Message[] | string) {
                let errorMessage: string = '';
                if (typeof emplArray === 'string') {
                    errorMessage = emplArray;
                } else {
                    setMessages(emplArray.map((e) => ({ ...e, timestamp: new Date(e.timestamp) })));
                }
                dispatch(errorMessage, '');
            },
        });
        return () => subscription.unsubscribe();
    }, []);
    return messages;
}
