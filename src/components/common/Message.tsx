import { Box, Paper, Typography } from '@mui/material';

type Props = {
    msg: any;
};

const AUTH_ITEM = 'auth-item';
const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');

const MessageForm: React.FC<Props> = ({ msg }) => {
    const isMyMessage: Boolean = msg.from === currentUser.email;

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
                        <strong>{msg.from}:</strong> 
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
