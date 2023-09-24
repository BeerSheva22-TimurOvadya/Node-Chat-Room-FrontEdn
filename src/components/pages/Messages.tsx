import { Box } from '@mui/material';
import { useState, useRef, useMemo } from 'react';
import { messagesService } from '../../config/service-config';

import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Delete } from '@mui/icons-material';
import { useSelectorAuth } from '../../redux/store';
import { Confirmation } from '../common/Confirmation';

import { useDispatchCode, useSelectorMessages } from '../../hooks/hooks';
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
        type: 'date',
        flex: 0.6,
        headerClassName: 'data-grid-header',
        align: 'center',
        headerAlign: 'center',
    },
];

const Messages: React.FC = () => {
    const columnsAdmin: GridColDef[] = [
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
    const columns = useMemo(() => getColumns(), [userData, messages]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const title = useRef('');
    const content = useRef('');
    const messageId = useRef('');
    const confirmFn = useRef<any>(null);
    function getColumns(): GridColDef[] {
        let res: GridColDef[] = columnsCommon;
        if (userData && userData.role === 'admin') {
            res = res.concat(columnsAdmin);
        }
        return res;
    }
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
                await messagesService.deleteMessage(messageId.current);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
            }}
        >
            <Box sx={{ height: '80vh', width: '95vw' }}>
                <DataGrid columns={columns} rows={messages} getRowId={(row) => row._id} />
            </Box>
            <Confirmation
                confirmFn={confirmFn.current}
                open={openConfirm}
                title={title.current}
                content={content.current}
            ></Confirmation>
        </Box>
    );
};
export default Messages;
