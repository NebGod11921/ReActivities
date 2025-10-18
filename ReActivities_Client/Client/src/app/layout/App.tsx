import { useEffect, useState} from "react";
import {Container, CssBaseline, } from "@mui/material";
import axios from "axios";
import Navbar from "./NavBar.tsx";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard.tsx";


function App() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);


    useEffect(() => {
        axios.get('https://localhost:5001/api/Activities')
            .then(res => setActivities(res.data))
        return () => {}
    },[])

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.find(x=>x.id === id))
    }

    const handleCancelActivity = () => {
        setSelectedActivity(undefined)
    }

    const handleOpenForm = (id?: string) => {
        if(id) handleSelectActivity(id)
        else handleCancelActivity();
        setEditMode(true);
    }
    const handleCloseForm = () => {
        setEditMode(false);
    }
    //creates a new array that excludes the deleted activity. (Filter)
    const handleDelete = (id: string) => {
        setActivities(activities.filter(x=>x.id !== id))
    }
    const handleSubmitForm = (activity: Activity) => {
        if(activity.id) {
            setActivities(activities.map(x=> x.id === activity.id ?
            activity : x))
        } else {
            const newActivity = {...activity, id: activities.length.toString()}
            setSelectedActivity(newActivity);
            setActivities([...activities, newActivity]);
        }
        setEditMode(false);
    }



    return (
        <>
            <CssBaseline/>
            <Navbar openForm={handleOpenForm} />
            <Container maxWidth='xl' sx={{mt:3}}>
                <ActivityDashboard activities={activities}
                                   selectActivity={handleSelectActivity}
                                   cancelSelectActivity = {handleCancelActivity}
                                   selectedActivity = {selectedActivity}
                                   editMode = {editMode}
                                   openForm = {handleOpenForm}
                                   closeForm = {handleCloseForm }
                                   submitForm = {handleSubmitForm}
                                   deleteActivity = {handleDelete}
                ></ActivityDashboard>
            </Container>

        </>
    )
}

export default App
