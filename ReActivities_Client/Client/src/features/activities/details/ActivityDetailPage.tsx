import {Grid, Typography} from "@mui/material";

import { useParams} from "react-router";
import {useActivities} from "../../../lib/hooks/useActivities.ts";
import ActivityDetailsHeader from "./ActivityDetailsHeader.tsx";
import ActivityDetailsInfo from "./ActivityDetailsInfo.tsx";
import ActivityDetailsChat from "./ActivityDetailsChat.tsx";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar.tsx";




export default function ActivityDetailPage() {
    // const navigate = useNavigate();
    const {id} = useParams();
    const {activity, isLoadingActivity} = useActivities(id);

    if(isLoadingActivity) {
        return <Typography>Loading...</Typography>;
    }


    if(!activity) {
        return <Typography>Activity not found...</Typography>
    }

    // <Card sx={{borderRadius: 3}}>
    //     <CardMedia
    //         component="img"
    //         src={`/images/categoryImages/${activity.category}.jpg`}
    //     ></CardMedia>
    //     <CardContent>
    //         <Typography variant="h5" >{activity.title}</Typography>
    //         <Typography variant="subtitle1" >{activity.date}</Typography>
    //         <Typography variant="body1" >{activity.description}</Typography>
    //     </CardContent>
    //     <CardActions>
    //         <Button component={Link} to ={`/manage/${activity.id}`} color='primary'>Edit</Button>
    //         <Button onClick={() => navigate('/activities')} color='inherit'>Cancel</Button>
    //     </CardActions>
    // </Card>

    return (
        <Grid container spacing={3}>
            <Grid size={8}>
                <ActivityDetailsHeader activity={activity} />
                <ActivityDetailsInfo activity={activity} />
                <ActivityDetailsChat/>
            </Grid>
            <Grid size={4}>
                <ActivityDetailsSidebar/>
            </Grid>

        </Grid>
    )
}
