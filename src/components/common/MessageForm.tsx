import { Avatar, Box, Paper, Typography } from '@mui/material';

type Props = {
    msg: any;
};
const AUTH_ITEM = 'auth-item';

const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');

const MessageForm: React.FC<Props> = ({ msg }) => {
    const message = msg || JSON.parse('{}');
    

    const isMyMessage: Boolean = msg.from == currentUser.email;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                mb: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMyMessage ? 'row-reverse' : 'row',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ bgcolor: isMyMessage ? 'secondary.main' : 'primary.main' }}>
                    {msg.from}
                </Avatar>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        ml: isMyMessage ? 1 : 0,
                        mr: isMyMessage ? 0 : 1,
                        backgroundColor: isMyMessage ? 'secondary.light' : 'primary.light',
                        borderRadius: isMyMessage ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    }}
                >
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography variant="overline">
                        {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default MessageForm;
