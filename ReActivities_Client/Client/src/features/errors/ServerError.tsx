import {useLocation} from "react-router";
import {Divider, Paper, Typography} from "@mui/material";

export default function ServerError() {
    const {state} = useLocation();
    return (
        <Paper>
            {state.error ? (
                <>
                    <Typography variant="body2" color="textSecondary" sx={{px: 4, pt: 2}} >
                        {state.error?.message || 'There has been an error'}
                    </Typography>
                    <Divider />
                    <Typography variant='body1' sx={{p:4}}>
                        {state.error?.details || 'Internal server error'}
                    </Typography>
                </>
            ) : (
                <Typography variant='h5'>Server error</Typography>
            )}
        </Paper>
    )
}
