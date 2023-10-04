import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';

interface Props {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSendMessage }) => {
    const [messageText, setMessageText] = useState<string>('');

    return (
        <Paper elevation={5} style={{ padding: '10px', display: 'flex', marginRight: '20px' }}>
            <TextField
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.altKey && messageText.trim()) {
                        onSendMessage(messageText);
                        setMessageText('');
                        e.preventDefault();
                    } else if (e.key === 'Enter' && e.altKey) {
                        setMessageText((prev: any) => prev + '\n');
                    }
                }}
                variant="outlined"
                fullWidth
                multiline
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => onSendMessage(messageText)}
                style={{ marginLeft: '10px' }}
            >
                Send
            </Button>
        </Paper>
    );
};

export default MessageInput;
