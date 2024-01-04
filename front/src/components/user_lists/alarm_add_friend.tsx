'use client'
import React from 'react';
import { axiosToken } from '@/util/token';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import HandshakeIcon from '@mui/icons-material/Handshake';

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import { useUserDataContext } from '@/app/main_frame/user_data_context';

// styled component (컴포넌트 고정 style로 보임)

// get cookie
import { useCookies } from 'next-client-cookies';



export default function AlarmAddFriend ( {alarm, alarmReducer, handleProfile, imageLoader, denyRequest} :any) {
    const cookies = useCookies();
    const { nickname, user_id } = useUserDataContext();

    const acceptFriendRequest = (alarm: any) => async () => {

        // console.log ('acceptFriendAddRequest - ', alarm)
        await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}social/acceptfriend`,
        {
          event_id: alarm.idx,
          user_id: alarm.to_id,
          user_nickname: nickname,
          friend_id: 0,
          friend_nickname: alarm.from_nickname
        },
        {
            headers: {
                'Authorization': `Bearer ${cookies.get('access_token')}`,
            }
        }
        )
        .then((response) => {
            if (response.status)
            {
                alarmReducer(alarm);
            }
        })
    };
  
    const labelId = `comment-list-secondary-label-${alarm.from_nickname}`;
    
    return (
      <div>
                <ListItem
                    // key={alarm.from_nickname}
                    disablePadding
                >
                <HandshakeIcon sx={{color: 'white'}}/>
                <ListItemButton onClick={handleProfile(alarm)}>
                    <ListItemAvatar>
                    <Avatar
                        src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
                    />
                    </ListItemAvatar>
                    <ListItemText id={labelId} sx={{color: 'white'}} primary={`${alarm.from_nickname}`} />
                </ListItemButton>
                <IconButton sx={{color: 'green'}} onClick={acceptFriendRequest(alarm)}>
                    <CheckCircleOutlineRoundedIcon />
                </IconButton>
                <IconButton sx={{color: 'red'}}onClick={denyRequest(alarm)}>
                    <ClearRoundedIcon />
                </IconButton>
                </ListItem>
        </div>
    );
  }
  