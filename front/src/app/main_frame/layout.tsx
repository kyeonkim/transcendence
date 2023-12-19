"use client"

import React, { useState, useCallback, useEffect } from 'react';
import MyProfile from '@/components/profile/my_profile';
import MatchingButton from '@/components/matching/matching';
import SearchUser from '@/components/search_bar/search_user';
import UserLists from '@/components/user_lists/user_lists';
import ChatBlock from '@/components/chatbox/chat_block';
import particlesOptions from "../particles.json";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { ISourceOptions } from "tsparticles-engine";
import type { Engine } from "tsparticles-engine";
import { Grid } from '@mui/material';

import ChatSocket  from './socket_provider';
import ChatBlockProvider from './shared_state';
import StatusContextProvider from './status_context';
import MainBoxContextProvider from './mainbox_context';
import UserDataContextProvider from './user_data_context';

import { useChatSocket } from "./socket_provider"

import styles from './frame.module.css';


// 여기에서는 context provider가 제공되고 있다 -> context 자체를 사용하는 건 불가능함
  // => socket은 직접 쓰는 곳이 없어서 문제가 없는데, (실제로는 undefined일 것)
  // setClick 등은 제공을 시도하고 있기에 문제가 생긴다.

  // 해결책
    // 1) 상위로 끌어올리기
        // 상위 layout에서 넣을 수는 없다. cookie-provider 때문에 server component여야 해서 setState 못씀
    // 2) 하위로 끌어내리기
        // 경로를 또 만들어서 layout 만드는 건 너무 좋지 않은 것 같다.
        // 자식 컴포넌트를 만들어서 그 안에서 사용하는 건, 어떨지 잘 모르겠다.

        // !!!!! prop으로 받고 있는 것들을 전부 context에서 받아가게 바꾼다 - 제일 근본적일 것 같음. 무식하지만.$
          // setMTBox는 어차피 빼고 싶었고, profile만 주의하면 될 것 같음.
export default function MainFrameLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [socketReady, setSocketReady] = useState(false);
  const socket = useChatSocket();

  console.log('socket - ', socket);
  // 아마 undefined일 것으로 판단됨.

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {

    // if (socket) {
    //   console.log('socket done');
    //   setSocketReady(true);
    // }
    
    // return () => {
      
    // };

    // socket보다 늦게 수행되는 이유 정리할 것. 
    setSocketReady(true);

  }, [socket]);


  // setMTBox 참조하는 함수들에 전부 세팅해주기. profile 쓰는 객체에도 설정하기.

  return (
    <section>
        <ChatSocket>
          <ChatBlockProvider>
          <MainBoxContextProvider>
            <UserDataContextProvider>
            <StatusContextProvider>
                {!socketReady && (
                  <div>
                    <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
                  </div>
                )}
                {socketReady && (
                  <>
                    <Particles options={particlesOptions as ISourceOptions} init={particlesInit} />
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
                  </>
                )}
            </StatusContextProvider>
            </UserDataContextProvider>
            </MainBoxContextProvider>
          </ChatBlockProvider>
        </ChatSocket>
    </section>
    )

}