import * as React from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import LoginData from '../../model/LoginData';
import InputResult from '../../model/InputResult';
import { StatusType } from '../../model/StatusType';
import { authService } from '../../config/service-config';
import { useRef, useState } from 'react';

const EMAIL_ERROR = 'Please enter a valid email.';
const PASSWORD_ERROR = 'Password should be at least 8 characters long.';
const defaultTheme = createTheme();

type Props = {
    submitFn: (loginData: LoginData) => Promise<InputResult>;
    registerFn: (loginData: LoginData) => Promise<InputResult>;
};
function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://tel-ran.com/">
                Tel-Ran
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const validate = {
    email: (email: string): boolean => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email),
    password: (password: string): boolean => password.length >= 8,
};

const SignInForm: React.FC<Props> = ({ submitFn, registerFn }) => {
    const message = useRef<string>('');
    const [open, setOpen] = useState(false);
    const severity = useRef<StatusType>('success');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [nickname, setNickname] = useState('');

    const validateForm = (email: string, password: string): boolean => {
        if (!validate.email(email)) {
            message.current = EMAIL_ERROR;
            severity.current = 'error';
            setOpen(true);
            return false;
        }

        if (!validate.password(password)) {
            message.current = PASSWORD_ERROR;
            severity.current = 'error';
            setOpen(true);
            return false;
        }

        return true;
    };

    const handleSignIn = async (email: string, password: string) => {
        const result = await submitFn({ email, password });
        message.current = result.message!;
        severity.current = result.status;
        message.current && setOpen(true);
    };
    const openDialog = () => {
        setDialogOpen(true);
    };

    const handleSignUp = async (email: string, password: string, nickname: string) => {
        const result = await registerFn({ email, password, nickname });
        message.current = result.message!;
        severity.current = result.status;
        message.current && setOpen(true);
    };

    function validateNickname(nickname: string): boolean {
        return nickname.length >= 3 && nickname.length <= 15;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email')! as string;
        const password: string = data.get('password')! as string;
        if (!validateForm(email, password)) return;
        handleSignIn(email, password);
    };

    const handleRegistration = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const form = document.forms[0];
        const data = new FormData(form);
        const email: string = data.get('email')! as string;
        const password: string = data.get('password')! as string;
        if (!validateForm(email, password)) return;
        handleCheckEmailAndOpenDialog(email);
    };

    const handleCheckEmailAndOpenDialog = async (email: string) => {
        const emailExists = await authService.checkEmailExists(email);
        if (emailExists) {
            message.current = 'User with this email already exists.';
            severity.current = 'error';
            setOpen(true);
        } else {
            openDialog();
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: { xs: 8, sm: -4, md: 8 },

                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container justifyContent={'center'} spacing={3}>
                            <Grid item xs={12} sm={6} md={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <Button type="submit" fullWidth variant="contained">
                                    Sign In
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6} md={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    onClick={handleRegistration}
                                >
                                    Sign up
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Snackbar open={open} autoHideDuration={10000} onClose={() => setOpen(false)}>
                        <Alert
                            onClose={() => setOpen(false)}
                            severity={severity.current}
                            sx={{ width: '100%' }}
                        >
                            {message.current}
                        </Alert>
                    </Snackbar>
                </Box>
                <Copyright sx={{ mt: 4, mb: 4 }} />
                <Dialog
                    open={isDialogOpen}
                    onClose={() => setDialogOpen(false)}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nickname"
                            label="Nickname"
                            type="text"
                            fullWidth
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                const form = document.forms[0];
                                const data = new FormData(form);
                                const email: string = data.get('email')! as string;
                                const password: string = data.get('password')! as string;

                                if (!validateNickname(nickname)) {
                                    message.current =
                                        'Nickname should be between 3 to 8 characters long.';
                                    severity.current = 'error';
                                    setOpen(true);
                                    return;
                                }

                                await handleSignUp(email, password, nickname);
                                setDialogOpen(false);
                            }}
                            color="primary"
                        >
                            Register
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};
export default SignInForm;
