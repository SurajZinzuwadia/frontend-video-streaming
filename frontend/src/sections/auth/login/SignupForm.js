import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function SignupForm() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [correctPassword, setCorrectPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // const handleLogin = async () => {
  //   const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  //   try {
  //     const response = await axios.post(`${apiBaseUrl}/api/login`, { email, password });
  //     if (response.data.user) {
  //       // Store the user data in local storage
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
  //       // Navigate to the dashboard or desired page after successful login
  //       navigate('/dashboard', { replace: true });
  //     } else {
  //       setError('Invalid credentials');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setError('An error occurred while logging in');
  //   }
  // };

  const handleSignup = async () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      if (password !== correctPassword) {
        // Check if passwords match
        toast.error('Passwords do not match', {
          position: toast.POSITION.BOTTOM_CENTER,
        }); // Show error toast
        return;
      }

      const response = await axios.post(`${apiBaseUrl}/api/auth/signup`, { name, email, password });
      if (response.data.user) {
        // Store the user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Display "Login successful" toast
        toast.success('Sign Up successful!', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // Navigate to the dashboard or desired page after successful login
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000); // Delay of 2 seconds (2000 milliseconds)
      } else {
        // Display error toast for unsuccessful login
        toast.error('Signup failed. Please try again.', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      setError(error.response.data.error);
      toast.error(error.response.data.error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Name" onChange={(e) => setName(e.target.value)} />
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
        <TextField
          name="correctPassword"
          label="Confirm Password"
          type="password"
          onChange={(e) => setCorrectPassword(e.target.value)}
        />
      </Stack>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

      <br />
      <LoadingButton fullWidth size="large" variant="contained" onClick={handleSignup}>
        Sign Up
      </LoadingButton>
      <ToastContainer />
    </>
  );
}
