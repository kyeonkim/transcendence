'use client'
import React from 'react'
import Button from '@mui/material/Button';
import type { Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback } from 'react';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import {redirect} from 'next/navigation';

const buttonStyle = {
  color : 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};


export default function Home() {
  const particlesInit = useCallback(async (engine: Engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const handleLogin = () => {
    window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URL;
  };


function ButtonUsage() {
  return <Button variant="contained" onClick={handleLogin}>Sign with 42</Button>;

}


  return (
    <>
    <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
    <div style={buttonStyle}>
      <ButtonUsage />
    </div>
    </>
  ) 
}
