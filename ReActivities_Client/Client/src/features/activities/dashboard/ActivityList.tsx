import {Box, Typography} from "@mui/material";
import ActivityCard from "./ActivityCard";
import {useActivities} from "../../../lib/hooks/useActivities.ts";
import {useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {observer} from "mobx-react-lite";


const ActivityList = observer(function ActivityList() {
    const {activitiesGroup, isLoading, hasNextPage, fetchNextPage} = useActivities();
    const {ref, inView} = useInView({
        threshold: 0.5, //
    });
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isLoading)
        return <Typography>Loading...</Typography>;

    if (!activitiesGroup) {
        return <Typography>No Activities found</Typography>
    }


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {activitiesGroup.pages.map((activities, index) =>
                (
                    <Box
                        ref={index === activitiesGroup.pages.length - 1 ? ref : null}
                        display='flex'
                        flexDirection='column'
                        gap={3}
                        key={index}>
                        {activities.items.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity}
                            ></ActivityCard>
                        ))}
                    </Box>
                ))}


        </Box>
    )
})

export default ActivityList;
