import { StatusType } from "./StatusType";

type InputResult = {
    status: StatusType;
    message?: string;
    user?: string;
}
export default InputResult;