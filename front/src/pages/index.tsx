'use client'
import React from 'react'
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';

const buttonStyle = {
  color : 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};


export default function Home() {
  const cookies = new Cookies();
  const token = cookies.get('access_token');
  const refresh_token = cookies.get('refresh_token');
  const handleLogin = () => {
    if (token && refresh_token)
      window.location.href = '/main';
    else
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a530d138cf1c33d448191cb250ee026f61f01d4d4cbbe62e0ff18ee285f9f290&redirect_uri=http%3A%2F%2F10.13.8.2%3A3000%2Foauth%2FLogin&response_type=code';
  };

function ButtonUsage() {
  return <Button variant="contained" onClick={handleLogin}>Hello world</Button>;
}


  return (
    <div style={buttonStyle}>
    {/* // <div> */}
      {/* <button onClick={handleLogin}>login button</button> */}
      <ButtonUsage />
      {/* <Button variant="contained" onClick={handleLogin}>Hello world</Button> */}
    </div>
  ) 
}
