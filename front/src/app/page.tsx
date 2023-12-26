'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation'
 

import { useCallback, useEffect } from 'react';
import particlesOptions from "./particles.json";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { Box, TextField } from '@mui/material';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [ init, setInit ] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => {
        setInit(true);
    });
}, []);

const particlesLoaded = async (container: Container) => {
    console.log(container);
};

  const handleLogin = () => {
    window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URL;
  };
  

  // const handleGuestLogin = (value :number) => {
  //   // console.log('handlerGusetLogin - ', value);
  //   router.push(`/guest?value=${value}`);
  //   // console.log('router push has done');
  // };

  const handleSignUp = () => {
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {init && <Particles id="tsparticles" options={particlesOptions as ISourceOptions} particlesLoaded={particlesLoaded}/>}
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
        </Box>
        {/* <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(1)} sx={{ marginRight: '8px' }}>
            Guest Login 1
          </Button>
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(2)} sx={{ marginRight: '8px' }}>
            Guest Login 2
          </Button>
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(3)} sx={{ marginRight: '8px' }}>
            Guest Login 3
          </Button>
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(4)} sx={{ marginRight: '8px' }}>
            Guest Login 4
          </Button>
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={() => handleGuestLogin(5)} sx={{ marginRight: '8px' }}>
            Guest Login 5
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}

