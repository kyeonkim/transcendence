'use client'
import React from 'react'
import Button from '@mui/material/Button';

const buttonStyle = {
  color : 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};


export default function Home() {
  const handleLogin = () => {
     window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a530d138cf1c33d448191cb250ee026f61f01d4d4cbbe62e0ff18ee285f9f290&redirect_uri=http%3A%2F%2F10.13.8.3%3A3000%2Flogin&response_type=code';
  };


function ButtonUsage() {
  return <Button variant="contained" onClick={handleLogin}>Hello world</Button>;

}


  return (
    <div style={buttonStyle}>
      <ButtonUsage />
    </div>
  ) 
}
