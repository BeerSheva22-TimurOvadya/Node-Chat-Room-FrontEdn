import {  useMemo, useState } from "react";
import intervals from '../../config/intervals.json'
import { getStatistics } from "../../service/EmployeesDataProcessor";
import Statistics from "../common/Statistics";
import { useSelectorEmployees } from "../../hooks/hooks";
const SalaryStatistics: React.FC = () => {
    const {salaryIntervals} = intervals;
    const employees = useSelectorEmployees();
    const [interval, setInterval] = useState(salaryIntervals[0])
    const statisticsData = useMemo(() => getStatistics(employees, "salary", interval),[employees, interval])
    
    return <Statistics title={"Salary Statistics"} intervalOptions={salaryIntervals} data={statisticsData} submitFn={function (intervalSelected: number): void {
       setInterval(intervalSelected) ;
    } } />

}
export default SalaryStatistics;