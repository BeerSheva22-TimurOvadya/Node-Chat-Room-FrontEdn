import React, { useState, useEffect, useRef } from 'react';
import { useSelectorMessages, useSelectorUsers } from '../../hooks/hooks';
import { messagesService } from '../../config/service-config';
import { Box, List, ListItemButton, ListItemText, TextField, Button, Paper } from '@mui/material';
import Message from '../../model/Message';
import MessageForm from '../common/Message';
import User from '../../model/User';
import { useSelector } from 'react-redux';
import { Menu, MenuItem } from '@mui/material';

const Chat: React.FC = () => {
    const users = useSelectorUsers();
    console.log('CHATS', users);
    const authData = useSelector((state: any) => state.authState.userData);
    const senderEmail = authData?.email;
    const messages = useSelectorMessages();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [messageText, setMessageText] = useState<string>('');
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const [unreadMessageCounts, setUnreadMessageCounts] = useState<Record<string, number>>({});

    const handleUserSelect = async (username: string) => {
        setSelectedUser(username);

        const messagesFromUser = messages.filter(
            (m) => m.from === username && m.to === senderEmail && !m.read,
        );

        if (messagesFromUser.length > 0) {
            await messagesService.markAsRead(username);

            calculateUnreadMessageCounts(messages);
        }
    };

    const calculateUnreadMessageCounts = (msgs: Message[]) => {
        const counts: Record<string, number> = {};

        msgs.forEach((msg) => {
            if (!msg.read && msg.to === senderEmail) {
                counts[msg.from] = (counts[msg.from] || 0) + 1;
            }
        });

        setUnreadMessageCounts(counts);
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

    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        calculateUnreadMessageCounts(messages);
    }, [messages]);

    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    const handleOpenContextMenu = (event: React.MouseEvent<HTMLDivElement>, messageId: string) => {
        event.preventDefault();
        setMenuPosition({ top: event.clientY, left: event.clientX });
        setSelectedMessageId(messageId);
    };

    const handleCloseContextMenu = () => {
        setMenuPosition(null);
        setSelectedMessageId(null);
    };

    const handleDeleteMessage = async () => {
        if (selectedMessageId) {
            try {
                await messagesService.deleteMessage(selectedMessageId);
            } catch (err) {
                console.error('Failed to delete message:', err);
            }
            handleCloseContextMenu();
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
                                primary={
                                    <>
                                        {user.nickname}
                                        {unreadMessageCounts[user.nickname] ? (
                                            <span style={{ marginLeft: 8, color: 'red' }}>
                                                {unreadMessageCounts[user.nickname]}
                                            </span>
                                        ) : null}
                                    </>
                                }
                                style={{
                                    color:
                                        user.status === 'BLOCKED'
                                            ? 'red'
                                            : user.onlineStatus === 'ONLINE'
                                            ? 'green'
                                            : 'black',
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
                        .filter(
                            (m) =>
                                (m.from === senderEmail && m.to === selectedUser) ||
                                (m.to === senderEmail && m.from === selectedUser),
                        )
                        .map((message, index) => (
                            <div
                                key={message._id || index}
                                onContextMenu={(e) =>
                                    handleOpenContextMenu(e, message._id)
                                }
                            >
                                <MessageForm msg={message} />
                            </div>
                        ))}
                    <div ref={messagesEndRef}></div>
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
                <Menu
                    open={Boolean(menuPosition)}
                    onClose={handleCloseContextMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={menuPosition ? menuPosition : undefined}
                >
                    <MenuItem onClick={handleDeleteMessage} style={{ color: 'red' }}>
                        DELETE
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Chat;
