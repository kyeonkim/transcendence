'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation'
import type { Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback } from 'react';
import particlesOptions from "./particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { Box, TextField } from '@mui/material';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const handleLogin = () => {
    window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URL;
  };
  
  const handleGuestLogin = (value :number) => {
    console.log('handlerGusetLogin - ', value);
    router.push(`/guest?value=${value}`);
    console.log('router push has done');
  };

  const handleSignUp = () => {
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        {/* <Box sx={{ marginBottom: '16px' }}>
          <TextField
            label="ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{ marginRight: '8px' }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ marginRight: '8px' }}
          />
        </Box> */}
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={handleLogin} sx={{ marginRight: '8px' }}>
            Sign In
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(0)} sx={{ marginRight: '8px' }}>
            Guest Login 0
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(1)} sx={{ marginRight: '8px' }}>
            Guest Login 1
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(2)} sx={{ marginRight: '8px' }}>
            Guest Login 2
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(3)} sx={{ marginRight: '8px' }}>
            Guest Login 3
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(4)} sx={{ marginRight: '8px' }}>
            Guest Login 4
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(5)} sx={{ marginRight: '8px' }}>
            Guest Login 5
          </Button>
          {/* <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
}
