import { useDispatch } from 'react-redux';
import InputResult from '../../model/InputResult';
import Input from '../common/Input';
import { messagesService } from '../../config/service-config';
import Message from '../../model/Message';
import CodePayload from '../../model/CodePayload';
import CodeType from '../../model/CodeType';
import { getRandomMessage } from '../../util/random';
import messageConfig from '../../config/messages-config.json';
import { codeActions } from '../../redux/slices/codeSlice';
const { minSalary, maxSalary, departments, minYear, maxYear } = messageConfig;
const MAX_AMOUNT = 20;
const Generation: React.FC = () => {
    const dispatch = useDispatch();
    function onSubmit(value: string): InputResult {
        const amount = +value;
        const res: InputResult = { status: 'success', message: '' };
        if (amount < 1 || amount > MAX_AMOUNT) {
            res.status = 'error';
            res.message = `amount must be in the range [1 - ${MAX_AMOUNT}]`;
        }
        generateMessages(amount);

        return res;
    }
    async function generateMessages(amount: number): Promise<void> {
        let message: string = '';
        let code: CodeType = CodeType.OK;
        let count: number = 0;
        for (let i = 0; i < amount; i++) {
            try {
                await messagesService.addMessage(
                    getRandomMessage(minSalary, maxSalary, minYear, maxYear, departments),
                );
                count++;
            } catch (error: any) {
                if (error.includes('Authentication')) {
                    code = CodeType.AUTH_ERROR;
                }
                message = error;
            }
        }
        message = `added ${count} messages ` + message;
        dispatch(codeActions.set({ code, message }));
    }
    return (
        <Input
            submitFn={onSubmit}
            placeholder={`amount of random Messages [1 - ${MAX_AMOUNT}]`}
            type="number"
            buttonTitle="Generate"
        />
    );
};
export default Generation;
