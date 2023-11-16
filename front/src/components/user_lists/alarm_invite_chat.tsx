'use client'
import { useState, useEffect } from 'react';
import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import AddCommentIcon from '@mui/icons-material/AddComment';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// get cookie
import { useCookies } from 'next-client-cookies';

import axios from 'axios';


export default function AlarmAddFriend ( {alarm, alarmReducer, handleProfile, imageLoader, denyRequest} :any) {
    const cookies = useCookies();

    const acceptFriendRequest = (alarm: any) => async () => {

        console.log ('acceptFriendAddRequest - ', alarm)
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}social/acceptfriend`,
        {
          "event_id": alarm.idx,
          "user_id": alarm.to_id,
          "user_nickname": cookies.get('nick_name'),
          "friend_id": 0,
          "friend_nickname": alarm.from_nickname
        })
        .then((response) => {
          console.log('accept event res=====',response)
            if (response.status)
            {
                console.log('trying to remove event from alarmList');
                alarmReducer(alarm);
                console.log('remove success');
            }
        })
        .catch((err) => {
            console.log('accepFriendAddRequest - api request failed');
        });
    };
  

    const joinChatoomRequest = async (ispassword :boolean, idx :number) => {

        // 비밀번호 여부


        // !!!!! 여길 수행하면, chatBlock을 rerender하게 만들고 싶다.
    };

    const acceptInviteChat = (alarm :any) => () => {
        
        checkUserInChat(alarm)
        .then((res :any) => {
            const room = res.data.userData.roomuser;
            if (room === null)
            {
                // 방 들어가기 함수
                joinChatoomRequest(
                    room.is_password,
                    room.idx);         
            }
            else
            {
                // 이미 채팅방에 들어가있습니다!
                // 예외 처리
                // 일단 아무것도 안함
            }
        })
        .catch();
    }


    const checkUserInChat = async (alarm :any) => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/id/${alarm.to_id}`)
    };

    const labelId = `comment-list-secondary-label-${alarm.from_nickname}`;
    console.log('alamr type - ', alarm);
    
    return (
      <div>
                <ListItem
                   key={alarm.from_nickname}
                   disablePadding
                >
                   <AddCommentIcon />
                   <ListItemButton onClick={handleProfile(alarm)}>
                       <ListItemAvatar>
                       <Avatar
                         src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
                       />
                       </ListItemAvatar>
                       <ListItemText id={labelId} primary={`${alarm.from_nickname}`} />
                   </ListItemButton>
                    <IconButton onClick={acceptInviteChat(alarm)}>
                       <CheckCircleOutlineRoundedIcon />
                   </IconButton>
                   <IconButton onClick={denyRequest(alarm)}>
                       <ClearRoundedIcon />
                   </IconButton>
                 </ListItem>
        </div>
    );
  }
  