import {
    AppBar,
    Box, CircularProgress,
    Container,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {Group} from "@mui/icons-material";
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
        <Box sx={{flexGrow: 1}}>
            <AppBar position="relative"
                    sx={{backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'}}>
                <Container maxWidth='xl'>
                    <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                        <Box>
                            <MenuItem component={NavLink} to="/" sx={{display: "flex", gap: 2}}>
                                <Group fontSize="large"></Group>
                                <Typography variant="h4" fontWeight='bold'
                                            sx={{position: 'relative'}}>Reactivities</Typography>
                                <Observer>
                                    {() => uiStore.isLoading ? (
                                        <CircularProgress color='secondary'
                                                          size={20}
                                                          thickness={7}
                                                          sx={{
                                                              position: 'absolute',
                                                              color: 'white',
                                                              top: '30%',
                                                              left: '105%'
                                                          }}>

                                        </CircularProgress>
                                    ) : null}
                                </Observer>


                            </MenuItem>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <MenuItemLink to="/activities">
                                Activities
                            </MenuItemLink>
                            <MenuItemLink to="/counter">
                                Counter
                            </MenuItemLink>
                            <MenuItemLink to="/errors">
                                Errors
                            </MenuItemLink>
                        </Box>
                        <Box display='flex' alignItems='center'>
                            {currentUser ? (
                                <UserMenu></UserMenu>
                            ) : (<>
                                <MenuItemLink to={'/login'}>Login</MenuItemLink>
                                <MenuItemLink to={'/register'}>Register</MenuItemLink>


                            </>)}
                        </Box>


                    </Toolbar>
                </Container>


            </AppBar>
        </Box>
    )
}
