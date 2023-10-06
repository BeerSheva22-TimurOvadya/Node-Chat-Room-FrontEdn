import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
    msg: any;
    findNicknameByEmail: (email: string) => string;
};

const AUTH_ITEM = 'auth-item';


const MessageForm: React.FC<Props> = ({ msg, findNicknameByEmail }) => {
    const [currentUser, setCurrentUser] = useState<any>({});
    
useEffect(() => {    
    setCurrentUser(JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}'));
}, []);

    const isMyMessage: Boolean = msg.from === currentUser.email;
    const nickname = findNicknameByEmail(msg.from);
    

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                mb: 1,
                mr: isMyMessage ? 1 : 0,
                ml: isMyMessage ? 0 : 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMyMessage ? 'row-reverse' : 'row',
                    alignItems: 'center',
                }}
            >
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        backgroundColor: isMyMessage ? 'lightgreen' : 'lightgray',
                        borderRadius: isMyMessage ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    }}
                >
                    <Typography variant="body1" component="div">
                        <strong>{nickname}:</strong>
                        <div>{msg.text}</div>
                    </Typography>
                    <Typography variant="overline">
                        {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default MessageForm;
