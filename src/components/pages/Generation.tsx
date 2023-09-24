import { useDispatch } from "react-redux";
import InputResult from "../../model/InputResult"
import Input from "../common/Input"
import { employeesService } from "../../config/service-config";
import Employee from "../../model/Employee";
import CodePayload from "../../model/CodePayload";
import CodeType from "../../model/CodeType";
import { getRandomEmployee } from "../../util/random";
import employeeConfig from '../../config/employees-config.json';
import { codeActions } from "../../redux/slices/codeSlice";
const {minSalary, maxSalary, departments, minYear, maxYear} = employeeConfig;
const MAX_AMOUNT = 20;
const Generation: React.FC = () => {
    const dispatch = useDispatch();
    function onSubmit(value: string): InputResult {
        const amount = +value;
        const res: InputResult = {status: 'success',
         message: ''};
         if (amount < 1 || amount > MAX_AMOUNT) {
            res.status = 'error';
            res.message = `amount must be in the range [1 - ${MAX_AMOUNT}]`;
         }
         generateEmployees(amount);

         return res;
    }
    async function generateEmployees(amount: number): Promise<void> {
        let message: string = '';
        let code: CodeType = CodeType.OK;
        let count: number = 0;
        for (let i = 0; i < amount; i++) {
            try {
                await 
                employeesService.addEmployee(getRandomEmployee(minSalary, maxSalary,
                    minYear, maxYear, departments));
                count++;
            } catch (error: any) {
               
    
               if( error.includes('Authentication')) {
                code = CodeType.AUTH_ERROR;
                
                
               } 
               message = error;
            }
            
           
         }
         message = `added ${count} employees ` + message;
         dispatch(codeActions.set({code, message}))
    }
    return <Input submitFn={onSubmit}
     placeholder={`amount of random Employees [1 - ${MAX_AMOUNT}]`} type="number" buttonTitle="Generate" />
}
export default Generation;