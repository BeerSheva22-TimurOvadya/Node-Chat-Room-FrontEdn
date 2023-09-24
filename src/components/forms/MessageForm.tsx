import React, { useState } from 'react';
import {
    FormControl,
    Grid,
    TextField,
    InputLabel,
    Select,
    Box,
    MenuItem,
    Button,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,    
} from '@mui/material';
import Message from '../../model/Message';

import InputResult from '../../model/InputResult';

type Props = {
    submitFn: (mess: Message) => Promise<InputResult>;
    messageUpdated?: Message;
};
const initialDate: any = 0;

const initialMessage: Message = {
    from: '',
    to: '',
    text: '',
    timestamp: initialDate    
};
export const MessageForm: React.FC<Props> = ({ submitFn, messageUpdated }) => {
    
    const [message, setMessage] = useState<Message>(messageUpdated || initialMessage);
    const [errorMessage, setErrorMessage] = useState('');
    function handlerName(event: any) {
        const name = event.target.value;
        const emplCopy = { ...message };
        emplCopy.from = name;
        setMessage(emplCopy);
    }
    function handlerBirthdate(event: any) {
        const birthDate = event.target.value;
        const emplCopy = { ...message };
        emplCopy.timestamp = new Date(birthDate);
        setMessage(emplCopy);
    }
    function handlerSalary(event: any) {
        const salary = event.target.value;
        const emplCopy = { ...message };
        emplCopy.to = salary;
        setMessage(emplCopy);
    }
    function handlerDepartment(event: any) {
        const department = event.target.value;
        const emplCopy = { ...message };
        emplCopy.text = department;
        setMessage(emplCopy);
    }
    function genderHandler(event: any) {
        setErrorMessage('');
        const gender = event.target.value;
        const emplCopy = { ...message };
        emplCopy.read = gender;
        setMessage(emplCopy);
    }
    async function onSubmitFn(event: any) {
        event.preventDefault();
        if (!message.read) {
            setErrorMessage('Please select gender');
        } else {
            const res = await submitFn(message);

            res.status === 'success' && event.target.reset();
        }
    }
    function onResetFn(event: any) {
        setMessage(messageUpdated || initialMessage);
    }

    return (
        <Box sx={{ marginTop: { sm: '25vh' } }}>
            <form onSubmit={onSubmitFn} onReset={onResetFn}>            

                <Box sx={{ marginTop: { xs: '10vh', sm: '5vh' }, textAlign: 'center' }}>
                    <Button type="submit">Submit</Button>
                    <Button type="reset">Reset</Button>
                </Box>
            </form>
        </Box>
    );
};
