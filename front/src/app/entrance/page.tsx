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
     window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3afc4b8a1109d8737d710c22763629e1194e1870826e1665c55be57215b35dd1&redirect_uri=http%3A%2F%2F10.13.9.4%3A3000%2Flogin&response_type=code';
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
