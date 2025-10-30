import {createBrowserRouter, Navigate} from "react-router";
import App from "../layout/App.tsx";
import HomePage from "../../features/home/HomePage.tsx";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard.tsx";
import ActivityForm from "../../features/activities/form/ActivityForm.tsx";
import ActivityDetailPage from "../../features/activities/details/ActivityDetailPage.tsx";
import Counter from "../../features/counter/Counter.tsx";
import TestErrors from "../../features/errors/TestErrors.tsx";
import NotFound from "../../features/errors/NotFound.tsx";
import ServerError from "../../features/errors/ServerError.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {path: '', element:<HomePage></HomePage>},
            {path: 'activities', element:<ActivityDashboard></ActivityDashboard>},
            {path: 'createActivity', element:<ActivityForm key='create'></ActivityForm>},
            {path: 'activities/:id', element:<ActivityDetailPage></ActivityDetailPage>},
            {path: 'manage/:id', element:<ActivityForm></ActivityForm>},
            {path: 'counter', element:<Counter></Counter>},
            {path: 'errors', element:<TestErrors></TestErrors>},
            {path: 'not-found', element:<NotFound></NotFound>},
            {path: 'server-error', element:<ServerError></ServerError>},
            {path: '*', element: <Navigate replace to='/not-found'></Navigate>}
        ]
    }
])