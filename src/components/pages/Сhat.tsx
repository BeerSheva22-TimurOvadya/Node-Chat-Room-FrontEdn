import React, { useState, useEffect } from 'react';
import { useSelectorMessages, useSelectorUsers } from '../../hooks/hooks';
import { messagesService } from '../../config/service-config';
import { Box, List, ListItemButton, ListItemText, TextField, Button, Paper } from '@mui/material';
import Message from '../../model/Message';
import MessageForm from '../common/MessageForm';
import User from '../../model/User';
import { useSelector } from 'react-redux';

const Chat: React.FC = () => {
    const users = useSelectorUsers();
    const authData = useSelector((state: any) => state.authState.userData);
    const senderEmail = authData?.email;
    const messages = useSelectorMessages();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [messageText, setMessageText] = useState<string>('');

    const handleUserSelect = (username: string) => {
        setSelectedUser(username);
    };

    const handleSendMessage = async () => {
        if (selectedUser && messageText) {
            try {
                const newMessage: Message = {
                    from: senderEmail,
                    to: selectedUser,
                    text: messageText,
                    timestamp: new Date(),
                };
                await messagesService.sendMessage(newMessage);
                setMessageText('');
            } catch (err) {
                console.error('Failed to send message:', err);
            }
        }
    };

    return (
        <Box display="flex" height="85vh" alignItems="stretch">
            <Paper
                elevation={5}
                style={{
                    width: '15%',
                    marginRight: '20px',
                    marginLeft: '20px',
                    maxHeight: '850px',
                    overflow: 'auto',
                }}
            >
                <List>
                    {users.map((user: User) => (
                        <ListItemButton
                            key={user.username}
                            onClick={() => handleUserSelect(user.username)}
                        >
                            <ListItemText
                                primary={user.username}
                                style={{
                                    color: user.onlineStatus === 'online' ? 'green' : 'black',
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>
            <Box display="flex" flexDirection="column" flex="1" height="85vh">
                <Paper
                    elevation={5}
                    style={{
                        flex: 1,
                        marginBottom: '10px',
                        marginRight: '20px',
                        maxHeight: '800px',
                        overflow: 'auto',
                    }}
                >
                    {messages
                        .filter((m) => m.from === selectedUser || m.to === selectedUser)
                        .map((message, index) => (
                            <MessageForm key={message._id || index} msg={message} />
                        ))}
                </Paper>
                <Paper elevation={5} style={{ padding: '10px', display: 'flex', marginRight: '20px' }}>
                    <TextField
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.altKey && messageText.trim()) {
                                handleSendMessage();
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
                        onClick={handleSendMessage}
                        style={{ marginLeft: '10px' }}
                    >
                        Send
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Chat;
