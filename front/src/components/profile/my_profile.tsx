import React from 'react';
import Image from 'next/image';
import styles from './myprofile.module.css'
import { Avatar, Grid } from '@mui/material';

import { useMainBoxContext } from '@/app/main_frame/mainbox_context';
import { useUserDataContext } from '@/app/main_frame/user_data_context';

export default function MyProfile(props: any) {
  const { setMTBox, profile, gameState } = useMainBoxContext();

  const { nickname, user_id } = useUserDataContext();
  const my_nick = nickname

  const handleMTbox = (num: number) => () => {
        setMTBox(num, my_nick);
  }

  const imageLoader = (src: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }

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