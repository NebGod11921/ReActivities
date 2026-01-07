import {Box, Typography} from "@mui/material";
import ActivityCard from "./ActivityCard";
import {useActivities} from "../../../lib/hooks/useActivities.ts";
import type {Activity} from "../../../lib/types";


export default function ActivityList() {
    const {activities, isLoading} = useActivities();

    if (isLoading)
        return <Typography>Loading...</Typography>;

    if(!activities) {
        return <Typography>No Activities found</Typography>
    }


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {activities.map((activity: Activity) => (
                <ActivityCard key={activity.id} activity={activity}


                ></ActivityCard>
            ))}

        </Box>
    )
}
