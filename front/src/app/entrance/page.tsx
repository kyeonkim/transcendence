'use client'
import React from 'react'
import Button from '@mui/material/Button';
import type { Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback } from 'react';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

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
  }, []); // useCallback: 함수를 캐싱해놓는다. 함수가 계속 생성되는 것을 방지한다.

  const handleLogin = () => {
     window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a530d138cf1c33d448191cb250ee026f61f01d4d4cbbe62e0ff18ee285f9f290&redirect_uri=http%3A%2F%2F10.13.8.3%3A3000%2Flogin&response_type=code';
  };


function ButtonUsage() {
  return <Button variant="contained" onClick={handleLogin}>Hello world</Button>;

}


  return (
    <>
    <div style={buttonStyle}>
      <ButtonUsage />
    </div>
    <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
    </>
  ) 
}
