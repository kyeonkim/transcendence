// 'use client';
// import React, { useState, useCallback, useEffect } from 'react';
// import MyProfile from '@/components/profile/my_profile';
// import MatchingButton from '@/components/matching/matching';
// import SearchUser from '@/components/search_bar/search_user';
// import UserLists from '@/components/user_lists/user_lists';
// import Mainbox from '@/components/mainbox/mainbox';
// import ChatBlock from '@/components/chatbox/chat_block';
// import particlesOptions from "../particles.json";
// import { loadFull } from "tsparticles";
// import Particles from "react-tsparticles";
// import { ISourceOptions } from "tsparticles-engine";
// import type { Engine } from "tsparticles-engine";
// import { useChatSocket } from "../../app/main_frame/socket_provider"
// import { Grid, Typography } from '@mui/material';

// import styles from './frame.module.css';


// export default function Main() {

//   return (
//     <>
//         {!socketReady && (
//           <div>
//             <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
//           </div>
//         )}
//         {socketReady && (
//           <>
//             <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
//             <Grid container className={styles.leftBox}>
//               <MyProfile setMTbox={handleClick} profile={profile}/>
//               <SearchUser setMTbox={handleClick}/>
//               <MatchingButton setMTbox={handleClick}/>
//               <UserLists setMTbox={handleClick}/>
//             </Grid>
//             <Grid container className={styles.mainBox}>
//               <Mainbox mod={clicked} search={id} setProfile={setProfile}/>
//             </Grid>
//             <Grid container className={styles.rightBox}>
//               <ChatBlock setMTbox={handleClick}/>
//             </Grid>
//           </>
//         )}
//     </>
//   );
//   }
