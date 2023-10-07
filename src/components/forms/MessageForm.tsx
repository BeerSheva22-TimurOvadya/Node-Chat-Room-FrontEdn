import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Message from '../../model/Message';

import InputResult from '../../model/InputResult';

type Props = {
    submitFn: (mess: Message) => Promise<InputResult>;
    messageUpdated?: Message;
};
const initialDate: any = 0;

const initialMessage: Message = {
    from: '',
    to: '',
    text: '',
    timestamp: initialDate,
};
export const MessageForm: React.FC<Props> = ({ submitFn, messageUpdated }) => {
    const [message, setMessage] = useState<Message>(messageUpdated || initialMessage);    

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(message);
        res.status === 'success' && event.target.reset();
    }
    function onResetFn(event: any) {
        setMessage(messageUpdated || initialMessage);
    }

    return (
        <Box sx={{ marginTop: { sm: '25vh' } }}>
            <form onSubmit={onSubmitFn} onReset={onResetFn}>
                <Box sx={{ marginTop: { xs: '10vh', sm: '5vh' }, textAlign: 'center' }}>
                    <Button type="submit">Submit</Button>
                    <Button type="reset">Reset</Button>
                </Box>
            </form>
        </Box>
    );
};
