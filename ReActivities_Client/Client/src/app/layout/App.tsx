import {Box, Container, CssBaseline} from "@mui/material";
import Navbar from "./NavBar.tsx";
import {Outlet, useLocation} from "react-router";
import HomePage from "../../features/home/HomePage.tsx";

function App() {
    const location = useLocation();

    return (
        <>
            <Box sx={{bgcolor: '#eeeeee', minHeight: '100vh'}}>
                <CssBaseline/>
                {location.pathname === '/' ? <HomePage></HomePage> : (
                    <>
                        <Navbar/>
                        <Container maxWidth='xl' sx={{mt: 3}}>
                            <Outlet></Outlet>
                        </Container>
                    </>
                )}

            </Box>
        </>
    )
}

export default App
