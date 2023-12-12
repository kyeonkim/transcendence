'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MyProfile from '@/components/profile/my_profile';
import MatchingButton from '@/components/matching/matching';
import SearchUser from '@/components/search_bar/search_user';
import UserLists from '@/components/user_lists/user_lists';
import Mainbox from '@/components/mainbox/mainbox';
import ChatBlock from '@/components/chatbox/chat_block';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { ISourceOptions } from "tsparticles-engine";
import type { Engine } from "tsparticles-engine";
import { useChatSocket } from "../../app/main_frame/socket_provider"
import Divider from '@mui/material/Divider';
import { Grid, Typography } from '@mui/material';

import styles from './frame.module.css';

// // Top left Box
// const TLBox = styled(Box) ({
//   // backgroundColor: 'grey',
//   top: 0,
//   left: 0,
//   width:400,
//   height:400,
//   position: 'absolute'
// });

// // Middle Left Box
// const MLBox = styled(Box) ({
//   backgroundColor: 'white',
//   top: 400,
//   left: 0,
//   width: 400,
//   height:250,
//   position: 'absolute',
//   // opacity: '0.7'
// });

// // Bottom Left Box
// const BLBox = styled(Box) ({
//   backgroundColor: 'rgba(255, 255, 255, 1)',
//   top: 650,
//   left: 0,
//   width: 400,
//   height: 682,
//   position: 'absolute',
// });

// // Middle Top Box
// const MTBox = styled(Box) ({
//   top: 0,
//   left: 400,
//   width: 1600,
//   height: 1332,
//   position: 'absolute'
// });


// const Chatbox = styled(Box) ({
//   top: 0,
//   left: 2000,
//   width: 560,
//   height: 1332,
//   position: 'absolute',
//   display: 'flex',
//   flexDirection: 'column',
// })


export default function Main() {
  const [clicked, setClick] = useState(0);
  const [id, setSearch] = useState('');
  const [socketReady, setSocketReady] = useState(false);
  const socket = useChatSocket();
  const [isSize, setIsSize] = useState(false);
  const [profile, setProfile] = useState('');

  const minWidth = 2000;
  const minHeight = 1000;

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
  //       console.log('잘작동중!!!!!!');
  //       setIsSize(true);
  //     } else {
  //       setIsSize(false);
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // 컴포넌트가 unmount되면 리스너 제거
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [minWidth]);

  const particlesInit = useCallback(async (engine: Engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const handleClick = (value: number, searchTarget?: string) => {
    setClick(value);
    setSearch(searchTarget || '');
  }
  const profileChange = (value: any) => {
    setProfile(value);
  }
  useEffect(() => {
    if (socket) {
      setSocketReady(true);
    }
    return () => {
      
    };
  }, [socket]);

  if (!socketReady) {
    console.log('socket not ready');
  
    return (
      <div>
        <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
      </div>
    );
  }

  return (
    <div>
      <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
      {/* {isSize ? (
        <Grid container className={styles.warning} justifyContent="center" alignItems="center">
          <Typography variant="caption" color="error" fontSize={'40px'}>
            화면을 늘려주세요!
          </Typography>
        </Grid>
      ) : (
      <>
        <Grid container className={styles.leftBox}>
          <MyProfile setMTbox={handleClick}/>
          <SearchUser setMTbox={handleClick}/>
          <MatchingButton setMTbox={handleClick}/>
          <UserLists setMTbox={handleClick}/>
        </Grid>
        <Grid container className={styles.mainBox}>
          <Mainbox mod={clicked} search={id}/>
        </Grid>
        <Grid container className={styles.rightBox}>
          <ChatBlock setMTbox={handleClick}/>
        </Grid>
      </>
      )} */}
      <Grid container className={styles.leftBox}>
        <MyProfile setMTbox={handleClick} profile={profile}/>
        <SearchUser setMTbox={handleClick}/>
        <MatchingButton setMTbox={handleClick}/>
        <UserLists setMTbox={handleClick}/>
      </Grid>
      <Grid container className={styles.mainBox}>
        <Mainbox mod={clicked} search={id} setProfile={setProfile}/>
      </Grid>
      <Grid container className={styles.rightBox}>
        <ChatBlock setMTbox={handleClick}/>
      </Grid>
    </div>
  );
}