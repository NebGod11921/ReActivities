import {Grid} from "@mui/material";
import ActivityList from "./ActivityList.tsx";


export default function ActivityDashboard() {
    return (

            <Grid container spacing={3}>
                <Grid size={7}>
                    <ActivityList></ActivityList>
                </Grid>
                <Grid size={5}>
                    Activity filters go here

                </Grid>
            </Grid>


    )
}
