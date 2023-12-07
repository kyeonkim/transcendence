import React from 'react';
import Image from 'next/image';
import styles from '../mainbox/mainbox.module.css'
import { useCookies } from 'next-client-cookies';
import { Avatar, Grid } from '@mui/material';

export default function MyProfile(props: any) {
  const { setMTbox, profile } = props;
  const cookies = useCookies();
  const my_nick = cookies.get('nick_name');



  const handleMTbox = (num: number) => () => {
    setMTbox(num, my_nick);
  }

  const imageLoader = (src: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }
  console.log('my_profile change ', profile)
  return (
    <Grid container className={styles.myprofileimg} alignItems='center' display='flex' padding='1%'>
      <Avatar
        src={imageLoader(`${my_nick}?${profile}`)}
        sx={{
          width: '100%',
          height: '100%',
          border: '2px solid #ffffff'
        }}
        onClick={handleMTbox(1)}
      />
      </Grid>
  );
}