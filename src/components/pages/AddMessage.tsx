import Message from "../../model/Message";
import { MessageForm } from "../forms/MessageForm";
import InputResult from "../../model/InputResult";
import { authService, messagesService } from "../../config/service-config";

import { useDispatchCode } from "../../hooks/hooks";

const AddMessage: React.FC = () => {
     let successMessage: string = '';
        let errorMessage = '';
        const dispatch = useDispatchCode();
    async function submitFn(empl: Message): Promise<InputResult> {
       
        const res: InputResult = {status: 'success', message: ''};
        try {
            const message: Message = await messagesService.addMessage(empl);
            successMessage = `message with id: ${message._id} has been added`
        } catch (error: any) {
           errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        return res;
    }
    return <MessageForm submitFn={submitFn}/>
}
export default AddMessage;