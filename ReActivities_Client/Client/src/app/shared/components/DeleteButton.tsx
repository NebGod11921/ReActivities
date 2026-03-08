import {Box, Button} from "@mui/material";
import {Delete, DeleteOutline} from "@mui/icons-material";


export default function DeleteButton() {
    return (
        <Box sx={{position: 'relative'}}>
            <Button sx ={
                {
                    opacity: 0.8,
                    position: 'relative',
                    transition: 'opacity 0.3s',
                    cursor: 'pointer',
                }
            }>
                <DeleteOutline
                    sx={{
                        fontSize: 32,
                        color: 'white',
                        position: 'absolute'
                    }}

                ></DeleteOutline>
                <Delete
                    sx={{
                        fontSize: 28,
                        color: 'red'

                    }}
                >

                </Delete>
            </Button>
        </Box>
    )
}
