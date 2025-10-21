import {FilterList, Event} from "@mui/icons-material";
import {Box, ListItemText, MenuItem, MenuList, Paper, Typography} from "@mui/material";
import 'react-calendar/dist/Calendar.css'
import Calendar from "react-calendar";
import '../../../app/layout/style.css';

export default function ActivityFilter() {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 3}}>

            {/* FILTER SECTION */}
            <Paper sx={{p: 3, borderRadius: 3}}>
                <Box sx={{width: '100%'}}>
                    <Typography
                        variant="h6"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            color: 'primary.main',
                        }}
                    >
                        <FilterList sx={{mr: 1}}/>
                        Filters
                    </Typography>

                    <MenuList>
                        <MenuItem>
                            <ListItemText primary="All events"/>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText primary="I'm going"/>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText primary="I'm hosting"/>
                        </MenuItem>
                    </MenuList>
                </Box>

            </Paper>

            {/* DATE PICKER SECTION */}
            <Box component={Paper}  sx={{p: 3, borderRadius: 3, width: '100%'}}>
                <Typography
                    variant="h6"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        color: 'primary.main',
                    }}
                >
                    <Event sx={{mr: 1}}/>
                    Select date
                </Typography>
                <Calendar className='react-calendar'></Calendar>
            </Box>
        </Box>
    );
}
