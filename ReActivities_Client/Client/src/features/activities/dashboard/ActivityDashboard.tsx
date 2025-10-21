import {Grid} from "@mui/material";
import ActivityList from "./ActivityList.tsx";
import ActivityFilter from "./ActivityFilter.tsx";


export default function ActivityDashboard() {
    return (

        <Grid container spacing={3}>
            <Grid size={8}>
                <ActivityList></ActivityList>
            </Grid>
            <Grid size={4}>
                <ActivityFilter></ActivityFilter>

            </Grid>
        </Grid>


    )
}
