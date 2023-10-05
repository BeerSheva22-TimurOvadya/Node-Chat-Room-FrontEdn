import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';
import { useState, useRef, useMemo, useEffect } from 'react';
import { serverService } from '../../config/service-config';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { useSelectorAuth } from '../../redux/store';
import { Confirmation } from '../common/Confirmation';
import { useDispatchCode, useSelectorMessages } from '../../hooks/hooks';


const Messages: React.FC = () => {
    const columnsCommon: GridColDef[] = [    
        
        {
            field: 'from',
            headerName: 'From',
            flex: 0.7,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'to',
            headerName: 'To',
            flex: 0.8,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'text',
            headerName: 'Text',
            flex: 0.8,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'timestamp',
            headerName: 'Timestamp',
            flex: 0.6,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: 'read',
            headerName: 'Status',
            flex: 0.7,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params) => {
                return [
                    <GridActionsCellItem
                        label="remove"
                        icon={<Delete />}
                        onClick={() => removeMessage(params.id)}
                    />,
                ];
            },
        },
    ];
    
    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const messages = useSelectorMessages();
    const [filteredMessages, setFilteredMessages] = useState(messages);

    const [openTextDialog, setOpenTextDialog] = useState(false);
    const [selectedMessageText, setSelectedMessageText] = useState("");

    const showMessageText = (text: string) => {
        setSelectedMessageText(text);
        setOpenTextDialog(true);
    };

    const closeMessageText = () => {
        setOpenTextDialog(false);
    };

    const showAllMessages = () => {
        setFilteredMessages(messages);
    };

    useEffect(() => {
        setFilteredMessages(messages);
    }, [messages]);

    const columns = useMemo(() => columnsCommon, [userData, messages]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const title = useRef('');
    const content = useRef('');
    const messageId = useRef('');
    const confirmFn = useRef<any>(null);


  

    function removeMessage(id: any) {
        title.current = 'Remove Message object?';
        const message = messages.find((mess) => mess._id === id);
        content.current = `You are going remove message with id ${message?._id}`;
        messageId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await serverService.deleteMessage(messageId.current);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }

    const showIncomingMessages = () => {
        if(userData){
            setFilteredMessages(messages.filter((message) => message.to === userData.email));
        }
        
    };

    const showOutgoingMessages = () => {
        if(userData){
            setFilteredMessages(messages.filter((message) => message.from === userData.email));
        }
        
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <ButtonGroup 
                variant="contained" 
                color="primary" 
                aria-label="contained primary button group"
                sx={{ marginBottom: 2 }}
            >
                <Button onClick={showIncomingMessages} sx={{ marginRight: 1 }}>Incoming</Button>
                <Button onClick={showOutgoingMessages} sx={{ marginRight: 1 }}>Outgoing</Button>
                <Button onClick={showAllMessages}>All</Button> {/* Новая кнопка */}
            </ButtonGroup>

            <Box sx={{ height: '80vh', width: '95vw', marginTop: 2 }}>
                <DataGrid 
                    columns={columns} 
                    rows={filteredMessages} 
                    getRowId={(row) => row._id}
                    onRowClick={(params) => showMessageText(params.row.text)}
                />
            </Box>

            <Dialog
                open={openTextDialog}
                onClose={closeMessageText}
            >
                <DialogTitle>Message Content</DialogTitle>
                <DialogContent>
                    <Typography>{selectedMessageText}</Typography>
                </DialogContent>
            </Dialog>

            <Confirmation
                confirmFn={confirmFn.current}
                open={openConfirm}
                title={title.current}
                content={content.current}
            />
        </Box>
    );
};

export default Messages;



