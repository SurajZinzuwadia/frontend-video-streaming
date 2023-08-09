import { useState, useEffect } from 'react';
import axios from 'axios';

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account, {updateAccountData} from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const [userAccount, setAccountName] = useState({ ...account }); // Assuming you already have the initial account data from the _mock/account

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  
  const handleClose = async () => {
    setOpen(null);
  };
  const handleLogOut = async () => {
    setOpen(null);
      try {
      const response = await axios.put(`${apiBaseUrl}/api/users/${userAccount._id}`, {isLive :true});
      // Make an API call to log out the user
      await axios.post(`${apiBaseUrl}/api/logout`);
      // Remove the user data from local storage upon logout (optional)
      localStorage.removeItem("user");
      // Redirect the user to the login page after successful logout
      window.location.href = "/login";
      } catch (error) {
        console.error('Logout error:', error);
      }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setAccountName({
        displayName: userData.name || 'Guest',
        email: userData.email || 'demo@minimals.cc',
        photoURL: userData.avatarUrl || '/assets/images/avatars/avatar_default.jpg',
        role: userData.role || 'Guest', // You may need to adjust this based on your user data structure
      });
    } else {
      // If user data not found, reset to default account data
      setAccountName({ ...account });
    }
  }, [open]);
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={userAccount.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userAccount.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userAccount.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogOut} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
