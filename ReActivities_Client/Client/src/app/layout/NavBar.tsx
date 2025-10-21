import {
    AppBar,
    Box,
    Container,
     MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {Group } from "@mui/icons-material";
import {NavLink} from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink.tsx";


export default function Navbar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'}}>
                <Container maxWidth='xl'>
                    <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                        <Box>
                            <MenuItem component={NavLink} to="/" sx={{display: "flex", gap: 2}}>
                                <Group fontSize="large"></Group>
                                <Typography variant="h4" fontWeight='bold'>Reactivites</Typography>

                            </MenuItem>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <MenuItemLink  to="/activities" >
                                Activities
                            </MenuItemLink>
                            <MenuItemLink  to="/createActivity">
                                Create Activity
                            </MenuItemLink>

                        </Box>
                        <MenuItem>
                            User menu
                        </MenuItem>



                    </Toolbar>
                </Container>



            </AppBar>
        </Box>
    )
}
