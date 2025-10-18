import './App.css'
import { useEffect, useState} from "react";
import {List, ListItem, ListItemText, Typography} from "@mui/material";
import axios from "axios";


function App() {
    const [activities, setActivities] = useState<Activity[]>([]);


    useEffect(() => {
        axios.get('https://localhost:5001/api/Activities')
            .then(res => setActivities(res.data))
        return () => {}
    },[])


    return (
        <div>
            <Typography variant='h3'>Reactivities</Typography>
            <List>
                {activities.map((activity) => (
                    <ListItem key={activity.id}>
                        <ListItemText>{activity.title}</ListItemText>
                    </ListItem>

                ))}
            </List>
        </div>
    )
}

export default App
