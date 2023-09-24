import { Box } from '@mui/material';
import { useState, useRef, useMemo } from 'react';
import { usersService } from '../../config/service-config';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { useSelectorAuth } from '../../redux/store';
import { Confirmation } from '../common/Confirmation';
import { useDispatchCode, useSelectorUsers } from '../../hooks/hooks';

const columnsCommon: GridColDef[] = [
    {
        field: 'username',
        headerName: 'Email',
        flex: 0.7,
        headerClassName: 'data-grid-header',
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'roles',
        headerName: 'Roles',
        flex: 0.7,
        headerClassName: 'data-grid-header',
        align: 'center',
        headerAlign: 'center',
    },

    {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        headerClassName: 'data-grid-header',
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'online',
        headerName: 'Status',
        flex: 0.8,
        headerClassName: 'data-grid-header',
        align: 'center',
        headerAlign: 'center',
    },
];

const Users: React.FC = () => {
    const columnsAdmin: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            getActions: (params) => {
                return [
                    <GridActionsCellItem
                        label="remove"
                        icon={<Delete />}
                        onClick={() => removeUser(params.id)}
                    />,
                ];
            },
        },
    ];
    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const users = useSelectorUsers();
    const columns = useMemo(() => getColumns(), [userData, users]);

    const [openConfirm, setOpenConfirm] = useState(false);

    const title = useRef('');
    const content = useRef('');
    const userId = useRef('');
    const confirmFn = useRef<any>(null);

    function getColumns(): GridColDef[] {
        let res: GridColDef[] = columnsCommon;
        if (userData && userData.role === 'admin') {
            res = res.concat(columnsAdmin);
        }
        return res;
    }
    function removeUser(id: any) {
        title.current = 'Remove User object?';
        const user = users.find((mes) => mes.username === id);
        content.current = `You are going remove user with id ${user?.username}`;
        userId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorUser: string = '';
        if (isOk) {
            try {
                await usersService.deleteUser(userId.current);
            } catch (error: any) {
                errorUser = error;
            }
        }
        dispatch(errorUser, '');
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
                <DataGrid columns={columns} rows={users} getRowId={(row) => row.username} />
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
export default Users;
