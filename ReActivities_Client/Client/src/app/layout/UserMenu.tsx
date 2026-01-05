import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useState} from "react";
import * as React from "react";
import {Avatar, Box, Divider, ListItemIcon} from "@mui/material";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import { Add, Logout, Person } from '@mui/icons-material';
import { Link } from 'react-router';

export default function UserMenu() {
    const {currentUser, logoutUser} = useAccount();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                color='inherit'
                size='large'
                sx={{fontSize: '1.1rem'}}

                onClick={handleClick}
            >
                <Box display='flex' alignItems='center' gap={2}>
                    <Avatar></Avatar>
                    {currentUser?.displayName}
                </Box>
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}

                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem component={Link} to='/createActivity' onClick={handleClose}>
                    <ListItemIcon>
                        <Add></Add>
                    </ListItemIcon>
                    <ListItemIcon>Create Activity</ListItemIcon>
                </MenuItem>
                <MenuItem component={Link} to='/profile' onClick={handleClose}>
                    <ListItemIcon>
                        <Person></Person>
                    </ListItemIcon>
                    <ListItemIcon>My Profile</ListItemIcon>
                </MenuItem>
                <Divider></Divider>
                <MenuItem component={Link} to='/logout' onClick={() => {
                    logoutUser.mutate();
                    handleClose();
                }}>
                    <ListItemIcon>
                        <Logout></Logout>
                    </ListItemIcon>
                    <ListItemIcon>Logout</ListItemIcon>
                </MenuItem>
            </Menu>
        </>
    );
}
