import {Grid, Typography} from "@mui/material";
import ProfileHeader from "./ProfileHeader.tsx";
import ProfileContent from "./ProfileContent.tsx";
import {useProfile} from "../../lib/hooks/useProfile.ts";
import {useParams} from "react-router";

export default function ProfilePage() {
    const {id} = useParams();
    const {profile, LoadingProfile} = useProfile(id);

    if(LoadingProfile) return <Typography>{LoadingProfile}</Typography>;
    if(!profile) return <Typography>Profile not found</Typography>;


    return (
        <Grid container >
            <Grid size={12}>
                <ProfileHeader ></ProfileHeader>
                <ProfileContent />
            </Grid>


        </Grid>
    )
}
