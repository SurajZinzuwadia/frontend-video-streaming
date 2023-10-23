import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, { email, password });
      if (response.data.user) {
        // Store the user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Display "Login successful" toast
        toast.success('Login successful!', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // Navigate to the dashboard or desired page after successful login
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000); // Delay of 2 seconds (2000 milliseconds)
      } else {
        // Display error toast for unsuccessful login
        toast.error('Invalid credentials', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while logging in');
      toast.error(error.response.data.error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
      <LoadingButton fullWidth size="large" variant="contained" onClick={handleLogin}>
        Login
      </LoadingButton>
      <ToastContainer />
    </>
  );
}
