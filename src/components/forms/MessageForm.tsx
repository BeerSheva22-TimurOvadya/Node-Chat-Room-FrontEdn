import React, { useRef, useState } from 'react';
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
    Snackbar,
    Alert,
} from '@mui/material';
import Message from '../../model/Message';
import messageConfig from '../../config/messages-config.json';
import InputResult from '../../model/InputResult';
import { StatusType } from '../../model/StatusType';
type Props = {
    submitFn: (empl: Message) => Promise<InputResult>;
    messageUpdated?: Message;
};
const initialDate: any = 0;
const initialGender: any = '';
const initialMessage: Message = {
    _id: 0,
    from: '',
    to: '',
    text: '',
    timestamp: initialDate,
    read: initialGender,
};
export const MessageForm: React.FC<Props> = ({ submitFn, messageUpdated }) => {
    const { minYear, minSalary, maxYear, maxSalary, departments } = messageConfig;
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

            res.status == 'success' && event.target.reset();
        }
    }
    function onResetFn(event: any) {
        setMessage(messageUpdated || initialMessage);
    }

    return (
        <Box sx={{ marginTop: { sm: '25vh' } }}>
            <form onSubmit={onSubmitFn} onReset={onResetFn}>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={8} sm={5}>
                        <FormControl fullWidth required>
                            <InputLabel id="select-department-id">Department</InputLabel>
                            <Select
                                labelId="select-department-id"
                                label="Department"
                                value={message.text}
                                onChange={handlerDepartment}
                            >
                                <MenuItem value="">None</MenuItem>
                                {departments.map((dep) => (
                                    <MenuItem value={dep} key={dep}>
                                        {dep}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={5}>
                        <TextField
                            type="text"
                            required
                            fullWidth
                            label="Message name"
                            helperText="enter Message name"
                            onChange={handlerName}
                            value={message.from}
                        />
                    </Grid>
                    <Grid item xs={8} sm={4} md={5}>
                        <TextField
                            type="date"
                            required
                            fullWidth
                            label="birthDate"
                            value={
                                message.timestamp
                                    ? message.timestamp.toISOString().substring(0, 10)
                                    : ''
                            }
                            inputProps={{
                                readOnly: !!messageUpdated,
                                min: `${minYear}-01-01`,
                                max: `${maxYear}-12-31`,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handlerBirthdate}
                        />
                    </Grid>
                    <Grid item xs={8} sm={4} md={5}>
                        <TextField
                            label="salary"
                            fullWidth
                            required
                            type="number"
                            onChange={handlerSalary}
                            value={message.to || ''}
                            helperText={`enter salary in range [${minSalary}-${maxSalary}]`}
                            inputProps={{
                                min: `${minSalary}`,
                                max: `${maxSalary}`,
                            }}
                        />
                    </Grid>
                    <Grid item xs={8} sm={4} md={5}>
                        <FormControl required error={!!errorMessage}>
                            <FormLabel id="gender-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="gender-group-label"
                                defaultValue=""
                                value={message.read || ''}
                                name="radio-buttons-group"
                                row
                                onChange={genderHandler}
                            >
                                <FormControlLabel
                                    value="female"
                                    control={<Radio />}
                                    label="Female"
                                    disabled={!!messageUpdated}
                                />
                                <FormControlLabel
                                    value="male"
                                    control={<Radio />}
                                    label="Male"
                                    disabled={!!messageUpdated}
                                />
                                <FormHelperText>{errorMessage}</FormHelperText>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: { xs: '10vh', sm: '5vh' }, textAlign: 'center' }}>
                    <Button type="submit">Submit</Button>
                    <Button type="reset">Reset</Button>
                </Box>
            </form>
        </Box>
    );
};
