import { Box, Container, Grid, FormControl, Select, InputLabel, MenuItem, Typography } from "@mui/material";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import { useRef } from "react";
import Chart from "./Chart";
export type StatisticsType = {
    id: any;
    min: number;
    max: number;
    amount: number
}[]
type Props = {
    title: string;
    intervalOptions: number[];
    data: StatisticsType;
    submitFn: (interval: number)=>void

}
const columns: GridColDef[] = [
    {field: "min", sortable: false, headerName: "Min ",type:"number",
     headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center', flex:0.5},
    {field: "max", sortable: false, headerName: "Max ", type:"number",
    headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center', flex: 0.5},
    {field: "amount", sortable: false, headerName: "Amount", type:"number",
    headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center', flex: 0.5}
]
const Statistics: React.FC<Props> = ({intervalOptions, submitFn, title, data}) => {
    const intervalValue = useRef(intervalOptions[0]);
    function handlerInterval(event: any) {
        const value: number = +event.target.value;
        intervalValue.current = value;
        submitFn(value);
    }

  return <Container >

        <Grid container justifyContent={'center'} spacing={1} >
            
            <Grid item xs={8}>
            <FormControl fullWidth required>
                        <InputLabel id="select-interval-id">Interval Value</InputLabel>
                        <Select labelId="select-interval-id" label="Distribution"
                             onChange={handlerInterval} value={intervalValue.current}>
                            {intervalOptions.map(o => <MenuItem value={o} key={o}>{o}</MenuItem>)}
                        </Select>
                    </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{width: "100%",
                 height: {xs: "30vh", sm: "60vh"}}}>
                    <DataGrid columns={columns} rows={data} rowHeight={20}/>
                </Box>
            </Grid>
            <Grid item xs={8} sm={6}>
                <Box sx={{width: "80%", height: "40vh"}}>
                    <Chart  yAxis={"Employees"}
                     data={data.map(s => ({key: s.min, amount: s.amount}))} dataKey={"key"} />
                </Box>
            </Grid>
        </Grid>
  </Container>
}
export default Statistics;