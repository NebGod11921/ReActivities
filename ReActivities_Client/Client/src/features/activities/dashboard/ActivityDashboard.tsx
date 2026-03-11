import {Grid} from "@mui/material";
import ActivityList from "./ActivityList.tsx";
import ActivityFilter from "./ActivityFilter.tsx";


export default function ActivityDashboard() {
    // const {isFetchingNextPage, fetchNextPage, hasNextPage} = useActivities();
    return (

        <Grid container spacing={3}>
            <Grid size={8}>
                <ActivityList></ActivityList>
                {/*<Button onClick={() => fetchNextPage()}*/}
                {/*        sx={{my: 2, float: 'right'}}*/}
                {/*        variant='contained'*/}
                {/*        disabled={!hasNextPage || isFetchingNextPage}*/}


                {/*>*/}
                {/*    Load More*/}
                {/*</Button>*/}
            </Grid>
            <Grid size={4}
                  sx={{
                      position: 'sticky',
                      top: 112,
                      alignSelf: 'flex-start'
                  }}

            >
                <ActivityFilter></ActivityFilter>

            </Grid>
        </Grid>


    )
}
