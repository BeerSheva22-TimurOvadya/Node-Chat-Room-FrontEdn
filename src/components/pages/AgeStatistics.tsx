import {  useMemo, useState } from "react";
import intervals from '../../config/intervals.json'
import { getStatistics } from "../../service/EmployeesDataProcessor";
import Statistics from "../common/Statistics";
import { useSelectorEmployees } from "../../hooks/hooks";
const AgeStatistics: React.FC = () => {
    const {ageIntervals} = intervals;
    const employees = useSelectorEmployees();
    const [interval, setInterval] = useState(ageIntervals[0])
    const statisticsData = useMemo(() => getStatistics(employees, "age", interval),[employees, interval])
    return <Statistics title={"Age Statistics"} intervalOptions={ageIntervals} data={statisticsData} submitFn={function (intervalSelected: number): void {
       setInterval(intervalSelected) ;
    } } />

}
export default AgeStatistics;