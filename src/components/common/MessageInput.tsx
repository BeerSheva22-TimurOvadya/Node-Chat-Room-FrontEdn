import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

interface Props {
    onSendMessage: (text: string) => void;
    selectedUser: string | null;
}

const MessageInput: React.FC<Props> = ({ onSendMessage, selectedUser }) => {
    const [messageText, setMessageText] = useState<string>('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣'];

    return (
        <Paper
            elevation={5}
            style={{ padding: '10px', display: 'flex', marginRight: '20px', position: 'relative' }}
        >
            <Button onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
                <EmojiEmotionsIcon />
            </Button>
            {emojiPickerOpen && (
                <Paper style={{ position: 'absolute', bottom: '60px', left: '20px' }}>
                    {emojis.map((emoji) => (
                        <Button
                            key={emoji}
                            onClick={() => {
                                setMessageText((prev) => prev + emoji);
                                setEmojiPickerOpen(false);
                            }}
                        >
                            {emoji}
                        </Button>
                    ))}
                </Paper>
            )}
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
                disabled={!selectedUser || !messageText.trim()}
                onClick={() => {
                    onSendMessage(messageText);
                    setMessageText('');
                }}
                style={{ marginLeft: '10px' }}
            >
                Send
            </Button>
        </Paper>
    );
};

export default MessageInput;
