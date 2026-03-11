import {FilterList, Event} from "@mui/icons-material";
import {Box, ListItemText, MenuItem, MenuList, Paper, Typography} from "@mui/material";
import 'react-calendar/dist/Calendar.css'
import Calendar from "react-calendar";
import '../../../app/layout/style.css';
import {useStore} from "../../../lib/hooks/useStore.ts";
import {observer} from "mobx-react-lite";

const ActivityFilters = observer(function ActivityFilter() {
    const {activityStore: {setFilter, setStartDate, filter, startDate}} = useStore();
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
                        <MenuItem
                            selected={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            <ListItemText primary="All events"/>
                        </MenuItem>
                        <MenuItem
                            selected={filter === 'isGoing'}
                            onClick={() => setFilter('isGoing')}
                        >
                            <ListItemText primary="I'm going"/>
                        </MenuItem>
                        <MenuItem
                            selected={filter === 'isHost'}
                            onClick={() => setFilter('isHost')}
                        >
                            <ListItemText primary="I'm hosting"/>
                        </MenuItem>
                    </MenuList>
                </Box>

            </Paper>

            {/* DATE PICKER SECTION */}
            <Box component={Paper} sx={{p: 3, borderRadius: 3, width: '100%'}}>
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
                <Calendar
                    value={startDate}
                    onChange={date => setStartDate(date as Date)}
                    className='react-calendar'></Calendar>
            </Box>
        </Box>
    );
})

export default ActivityFilters;