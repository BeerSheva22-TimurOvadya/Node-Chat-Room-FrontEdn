import { StatisticsType } from "../components/common/Statistics";
import Employee from "../model/Employee";
import { getAge } from "../util/date-functions";
import { count } from "../util/number-functions";

export function getStatistics(employees: Employee[], type: string, interval: number): StatisticsType {
    
    if (type === 'age') {
        employees = getEmployeesAges(employees);
    }
    return distribution(count(employees, type, interval), interval);
}
function getEmployeesAges(employees: Employee[]):any[]  {
    return employees.map(e => ({age: getAge(e.birthDate)}));
}
function distribution(countsObj: any, interval: number ): StatisticsType {
    return Object.entries(countsObj).map(e => ({min: +e[0] * interval,
         max: +e[0] * interval + interval - 1, amount: e[1] as number, id: e[0]}))
}

