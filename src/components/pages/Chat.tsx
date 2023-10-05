import React, { useState, useEffect, useRef } from 'react';
import { useSelectorMessages, useSelectorUsers } from '../../hooks/hooks';
import { serverService } from '../../config/service-config';
import { Box, List, ListItemButton, ListItemText, TextField, Button, Paper } from '@mui/material';
import Message from '../../model/Message';
import MessageForm from '../common/Message';
import User from '../../model/User';
import { useSelector } from 'react-redux';
import { Menu, MenuItem } from '@mui/material';
import MessageInput from '../common/MessageInput';

const Chat: React.FC = () => {
    const users = useSelectorUsers();
    const authData = useSelector((state: any) => state.authState.userData);
    const senderEmail = authData?.email;
    const messages = useSelectorMessages();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const [unreadMessageCounts, setUnreadMessageCounts] = useState<Record<string, number>>({});

    const handleUserSelect = async (username: string) => {
        setSelectedUser(username);

        const messagesFromUser = messages.filter(
            (m) => m.from === username && m.to === senderEmail && !m.read,
        );

        if (messagesFromUser.length > 0) {
            await serverService.markAsRead(username);
            setUnreadMessageCounts((prevCounts) => {
                return { ...prevCounts, [username]: 0 };
            });
        }
    };

    const calculateUnreadMessageCounts = (msgs: Message[]) => {
        const counts: Record<string, number> = {};
        msgs.forEach((msg) => {
            if (!msg.read && msg.to === senderEmail && msg.from !== selectedUser) {
                counts[msg.from] = (counts[msg.from] || 0) + 1;
            }
        });
        setUnreadMessageCounts(counts);
    };

    const handleSendMessage = async (text: string) => {
        if (selectedUser && text) {
            try {
                const newMessage: Message = {
                    from: senderEmail,
                    to: selectedUser,
                    text: text,
                    timestamp: new Date(),
                };
                serverService.sendMessage(newMessage);
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
    const findNicknameByEmail = (email: string) => {
        const user = users.find((u) => u.username === email);
        return user?.nickname || email;
    }

    const handleDeleteMessage = async () => {
        if (selectedMessageId) {
            try {
                await serverService.deleteMessage(selectedMessageId);
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
                    {users
                        .filter((user) => user.username !== senderEmail) 
                        .map((user: User) => (
                            <ListItemButton
                                key={user.username}
                                onClick={() => handleUserSelect(user.username)}
                                style={{
                                    backgroundColor:
                                        user.username === selectedUser ? '#e0e0e0' : 'transparent',
                                }} 
                            >
                                <ListItemText
                                    primary={
                                        <>
                                            {user.nickname}
                                            {unreadMessageCounts[user.username] ? (
                                                <span style={{ marginLeft: 8, color: 'red' }}>
                                                    {unreadMessageCounts[user.username]}
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
                        .sort(
                            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                        )
                        .map((message, index) => (
                            <div
                                key={message._id || index}
                                onContextMenu={(e) => handleOpenContextMenu(e, message._id)}
                            >
                                <MessageForm msg={message} findNicknameByEmail={findNicknameByEmail} />
                            </div>
                        ))}
                    <div ref={messagesEndRef}></div>
                </Paper>
                <MessageInput onSendMessage={handleSendMessage} />
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
