import {createBrowserRouter} from "react-router";
import App from "../layout/App.tsx";
import HomePage from "../../features/home/HomePage.tsx";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard.tsx";
import ActivityForm from "../../features/activities/form/ActivityForm.tsx";
import ActivityDetails from "../../features/activities/details/ActivityDetails.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {path: '', element:<HomePage></HomePage>},
            {path: 'activities', element:<ActivityDashboard></ActivityDashboard>},
            {path: 'createActivity', element:<ActivityForm key='create'></ActivityForm>},
            {path: 'activities/:id', element:<ActivityDetails></ActivityDetails>},
            {path: 'manage/:id', element:<ActivityForm></ActivityForm>}
        ]
    }
])