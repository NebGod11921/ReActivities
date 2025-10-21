import {Box, Container, CssBaseline} from "@mui/material";
import Navbar from "./NavBar.tsx";
import { Outlet } from "react-router";

function App() {

    return (
        <>
            <Box sx={{bgcolor: '#eeeeee', minHeight: '100vh'}}>
                    <CssBaseline/>
                    <Navbar  />
                    <Container maxWidth='xl' sx={{mt:3}}>
                       <Outlet></Outlet>
                    </Container>
            </Box>
        </>
    )
}

export default App
