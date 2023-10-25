'use client'
import React from 'react'
import Button from '@mui/material/Button';
<<<<<<< HEAD:front/src/pages/index.tsx
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
=======
// import Cookies from 'universal-cookie';
>>>>>>> FRONT-kshim:front/src/app/entrance/page.tsx

const buttonStyle = {
  color : 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};


export default function Home() {
<<<<<<< HEAD:front/src/pages/index.tsx
  const router = useRouter();
  const handleLogin = () => {
    if (getCookie('access_token') && getCookie('refresh_token'))
      router.push('/main');
    else
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a530d138cf1c33d448191cb250ee026f61f01d4d4cbbe62e0ff18ee285f9f290&redirect_uri=http%3A%2F%2F10.13.8.3%3A3000%2Foauth%2FLogin&response_type=code';
=======
  const handleLogin = () => {
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0df03a6be6b8b865402f4b719f20c1dcc04c4a3d0f47e9a5f2c58b9baa87cd12&redirect_uri=http%3A%2F%2F10.13.8.1%3A3000%2Flogin&response_type=code';
>>>>>>> FRONT-kshim:front/src/app/entrance/page.tsx
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
