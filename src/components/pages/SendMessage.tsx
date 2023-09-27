import React, { useState, ChangeEvent } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
} from '@mui/material';
import { useSelectorUsers } from '../../hooks/hooks';
import { messagesService } from '../../config/service-config';
import { useDispatchCode } from '../../hooks/hooks';
import { useSelector } from 'react-redux';
import Message from '../../model/Message';

const SendMessage: React.FC = () => {
    const authData = useSelector((state: any) => state.authState.userData); // предполагая, что ваш срез аутентификации называется authState
    const senderEmail = authData?.email;
    const [message, setMessage] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const users = useSelectorUsers();
    const dispatch = useDispatchCode();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleRecipientChange = (event: SelectChangeEvent<string>) => {
        setRecipient(event.target.value || '');
    };

    const handleSubmit = async () => {
        if (recipient && message) {
            try {
                const newMessage: Message = {
                    from: senderEmail, // Используйте email отправителя
                    to: recipient,
                    text: message,
                    timestamp: new Date(),
                };

                await messagesService.sendMessage(newMessage);
                dispatch('', 'Message sent successfully!');
                setMessage('');
                setRecipient('');
            } catch (error: any) {
                dispatch(error, '');
            }
        } else {
            dispatch('Recipient and message cannot be empty', '');
        }
    };

    const handleClear = () => {
        setMessage('');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                p: 2,
            }}
        >
            <FormControl variant="filled" sx={{ mb: 2 }}>
                <InputLabel id="recipient-label">Recipient</InputLabel>
                <Select labelId="recipient-label" value={recipient} onChange={handleRecipientChange}>
                    {users.map((user) => (
                        <MenuItem key={user.username} value={user.username}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                variant="filled"
                multiline
                rows={4}
                label="Message"
                value={message}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Send
                </Button>
                <Button variant="outlined" color="error" onClick={handleClear}>
                    Clear
                </Button>
            </Box>
        </Box>
    );
};

export default SendMessage;
