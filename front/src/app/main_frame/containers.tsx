'use client';
import { useState } from 'react';
import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import MyProfile from '@/components/profile/my_profile';
import MatchingButton from '@/components/matching/matching';
import ChatRoomButton from '@/components/chat_room/chat_room_button';
import SearchUser from '@/components/search_bar/search_user';
import UserLists from '@/components/user_lists/user_lists';
import GuardLogin from '@/components/guard_login';
// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// import Button from '@mui/material/Button';
// import  Notlogin  from '../components/notlogin';

//mainbox
import Mainbox from '@/components/mainbox';

// Top left Box
const TLBox = styled(Box) ({
  backgroundColor: 'grey',
  top: 0,
  left: 0,
  width:400,
  height:400,
  position: 'absolute'
});

// Middle Left Box
const MLBox = styled(Box) ({
  backgroundColor: 'white',
  top: 400,
  left: 0,
  width: 400,
  height:450,
  position: 'absolute'
});

// Bottom Left Box
const BLBox = styled(Box) ({
  backgroundColor: 'green',
  top: 655,
  left: 0,
  width: 400,
  height:0,
  position: 'absolute',
});

// Middle Top Box
const MTBox = styled(Box) ({
  backgroundColor: 'skyblue',
  top: 0,
  left: 400,
  width: 1600,
  height: 1332,
  position: 'absolute'
});


const Chatbox = styled(Box) ({
  backgroundColor: 'black',
  top: 0,
  left: 2000,
  width: 560,
  height: 1332,
  position: 'absolute'
})

export default function Main() {
  const [clicked, setClick] = useState(0);
  const [id, setSearch] = useState('');

  const handleClick = (value: number, searchTarget: string) => {
    setClick(value);
    setSearch(searchTarget);
  }
  // 나중에 쿠키에 내닉네임 저장하던가해서 전역으로 사용필
  let name = "min";
  return (
        <React.Fragment>
          <CssBaseline />
          {/* <GuardLogin> */}
            <TLBox>
              <MyProfile setMTbox={handleClick} myNickname={name}/>
            </TLBox>
            <MTBox>
              <Mainbox mod={clicked} search={id}/>
            </MTBox>
            <MLBox>
              <SearchUser setMTbox={handleClick}/>
              <MatchingButton setMTbox={handleClick}/>
              <ChatRoomButton setMTbox={handleClick}/>
            </MLBox>
            <BLBox>
              <UserLists />
            </BLBox>
          <Chatbox></Chatbox>
          {/* </GuardLogin> */}
        </React.Fragment>
    )
  }
  