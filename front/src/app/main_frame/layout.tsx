"use client"

import React, { useState, useCallback, useEffect } from 'react';
import MyProfile from '@/components/profile/my_profile';
import MatchingButton from '@/components/matching/matching';
import SearchUser from '@/components/search_bar/search_user';
import UserLists from '@/components/user_lists/user_lists';
import ChatBlock from '@/components/chatbox/chat_block';
import particlesOptions from "../particles.json";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

 
import { Grid } from '@mui/material';

import ChatSocket  from './socket_provider';
import ChatBlockProvider from './shared_state';
import StatusContextProvider from './status_context';
import MainBoxContextProvider from './mainbox_context';
import UserDataContextProvider from './user_data_context';

import { useCookies } from "next-client-cookies"

import { useChatSocket } from "./socket_provider"

import { axiosToken } from '@/util/token';

import styles from './frame.module.css';


export default function MainFrameLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const socket = useChatSocket();
  const cookies = useCookies();
  const [ init, setInit ] = useState(false);
  // console.log('socket - ', socket);
  // 아마 undefined일 것으로 판단됨.
  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => {
        setInit(true);
    });
  }, []);

  const particlesLoaded = async (container: Container) => {
      // console.log(container);
  };
  
  

  useEffect(() => {
        // api로 nickname 가져오기
      const fetchUserData = async () => {
        await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/mydata`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('access_token')}`
            },        
        }) 
        .then((res :any) => {
            // console.log(`====================\nchatsocket context - fetchi\n====================`,res);
            if (res.data.status === true)
            {
                setUserData(res.data.userData);
            }
        })
      }
      fetchUserData();
  }, []);

  useEffect(() => {
    // console.log('before userData', userData, loading);
    // console.log('before userData', Object.keys(userData).length);
    if (Object.keys(userData).length !== 0)
    {
      // console.log('userData length - ', Object.keys(userData).length);
      // console.log('after userData', userData, loading);
      setLoading(true);
    }
  }, [userData])
  // setMTBox 참조하는 함수들에 전부 세팅해주기. profile 쓰는 객체에도 설정하기.

  return (
    <section>
      {!loading && (
        <div>
          {init && <Particles id="tsparticles" options={particlesOptions as ISourceOptions} particlesLoaded={particlesLoaded}/>}
        </div>
      )}
      {loading && 
        <ChatSocket my_name={userData.nick_name} my_id={userData.user_id}>
          <ChatBlockProvider>
            <UserDataContextProvider my_name={userData.nick_name} my_id={userData.user_id}>
            <MainBoxContextProvider>
            <StatusContextProvider>
            {init && <Particles id="tsparticles" options={particlesOptions as ISourceOptions} particlesLoaded={particlesLoaded}/>}
                <Grid container className={styles.leftBox}>
                  <MyProfile />
                  <SearchUser />
                  <MatchingButton />
                  <UserLists />
                </Grid>
                <Grid container className={styles.mainBox}>
                    {children}
                </Grid>
                <Grid container className={styles.rightBox}>
                  <ChatBlock />
                </Grid>
            </StatusContextProvider>
            </MainBoxContextProvider>
            </UserDataContextProvider>
          </ChatBlockProvider>
        </ChatSocket>
      }
    </section>
    )

}