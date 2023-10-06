import { Box, MenuItem } from '@mui/material';
import { useState, useRef, useMemo } from 'react';
import { serverService } from '../../config/service-config';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { useSelectorAuth } from '../../redux/store';
import { Confirmation } from '../common/Confirmation';
import { useDispatchCode, useSelectorUsers } from '../../hooks/hooks';
import { Button, Popover } from '@mui/material';

const Users: React.FC = () => {
    const columnsCommon: GridColDef[] = [
        {
            field: 'nickname',
            headerName: 'Nick Name',
            flex: 0.7,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
        },
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
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color={params.value === 'ACTIVE' ? 'primary' : 'secondary'}
                    onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                        setSelectedUser(params);
                    }}
                >
                    {params.value}
                </Button>
            ),
        },

        {
            field: 'onlineStatus',
            headerName: 'onlineStatus',
            flex: 0.8,
            headerClassName: 'data-grid-header',
            align: 'center',
            headerAlign: 'center',
        },
    ];

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

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [openConfirm, setOpenConfirm] = useState(false);

    const title = useRef('');
    const content = useRef('');
    const userId = useRef('');
    const confirmFn = useRef<any>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user => user.username !== userData?.email);
    }, [users, userData]);

    function handleStatusChange(params: any, newStatus: string) {
        if (userData && userData.role === 'admin') {
            title.current = 'Change Status?';
            const user = users.find((mes) => mes.username === params.id);
            content.current = `Are you sure you want to change the status of ${user?.username} from ${params.value} to ${newStatus}?`;
            userId.current = params.id;
            confirmFn.current = (isOk: boolean) => {
                if (isOk) {
                    actualStatusChange(params.id, newStatus);
                }
                setAnchorEl(null);
                setOpenConfirm(false);
            };
            setOpenConfirm(true);
        }
    }
    async function actualStatusChange(username: string, newStatus: string) {
        try {
            await serverService.updateUserStatus(username, newStatus);
        } catch (error: any) {
            dispatch(error, '');
        }
        setOpenConfirm(false);
    }

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
        content.current = `You are going remove user with email: ${user?.username} and nickname: ${user?.nickname}`;
        userId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }

    async function actualRemove(isOk: boolean) {
        let errorUser: string = '';
        if (isOk) {
            try {
                await serverService.deleteUser(userId.current);
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
            <DataGrid columns={columns} rows={filteredUsers} getRowId={(row) => row.username} />
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <MenuItem onClick={() => handleStatusChange(selectedUser, 'ACTIVE')}>
                        ACTIVE
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange(selectedUser, 'BLOCKED')}>
                        BLOCKED
                    </MenuItem>
                </Popover>
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
