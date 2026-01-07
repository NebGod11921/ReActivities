import {
    AppBar,
    Box,
    Container, LinearProgress,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {Group } from "@mui/icons-material";
import {NavLink} from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink.tsx";
import {useStore} from "../../lib/hooks/useStore.ts";
import {Observer} from "mobx-react-lite";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import UserMenu from "./UserMenu.tsx";


export default function Navbar() {
    const {uiStore} = useStore();
    const {currentUser} = useAccount();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="relative" sx={{backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'}}>
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
                            <MenuItemLink  to="/counter">
                                Counter
                            </MenuItemLink>
                            <MenuItemLink  to="/errors">
                                Errors
                            </MenuItemLink>
                        </Box>
                        <Box display='flex' alignItems='center'>
                            {currentUser ? (
                                <UserMenu></UserMenu>
                            ): (<>
                                <MenuItemLink to={'/login'}>Login</MenuItemLink>
                                <MenuItemLink to={'/register'}>Register</MenuItemLink>


                            
                            </>)}
                        </Box>



                    </Toolbar>
                </Container>

                <Observer>
                    {() => uiStore.isLoading ? (
                        <LinearProgress color='secondary' sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 4
                        }}>

                        </LinearProgress>
                    ) : null}
                </Observer>


            </AppBar>
        </Box>
    )
}
