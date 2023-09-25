import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Button } from '@mui/material';
import { authService } from '../../config/service-config';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await authService.logout();
        dispatch(authActions.reset());
    };

    return <Button onClick={handleLogout}>confirm sign out</Button>;
}
 
 export default SignOut;