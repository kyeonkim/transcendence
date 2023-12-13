'use client'
import { useState, useEffect } from 'react';
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CommentIcon from '@mui/icons-material/Comment';

import SportsTennisIcon from '@mui/icons-material/SportsTennis';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';


// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// get cookie
import { useCookies } from 'next-client-cookies';
import { useChatSocket } from "@/app/main_frame/socket_provider";
import axios from 'axios';

import AlarmAddFriend from './alarm_add_friend';
import AlarmInviteChat from './alarm_invite_chat'
import AlarmInviteGame from './alarm_invite_game'
import { axiosToken } from '@/util/token';

const MainAlarmPanal = styled(Box) ({
    position: 'absolute',
    top: 60,
    backgroundColor: 'white'
  })

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  opacity: 0.5
  };

export default function AlarmListPanal (props: any) {
	const [openModal, setOpenModal] = useState(false);
	const [selectedAlarm, setSelectedAlarm] = useState(-1);

  const cookies = useCookies();
  const socket = useChatSocket();

  const alarmList = props.alarmList;
  const alarmListRemover = props.alarmListRemover;
  const alarmCountHandler = props.alarmCountHandler;
  const handleAlarmRerender = props.handleAlarmRerender;
  const setMTbox = props.setMTbox;



  const alarmReducer = (alarm :any) => {
      if (alarm.event_type === 'game')
        setMTbox(2);
      alarmListRemover(alarm);
      alarmCountHandler(false);
  }

  const removeEventFromDatabase = async (alarm: any) => {
        
      console.log('in removeEnventfromDatabase - ', alarm);
      await axiosToken.delete(`${process.env.NEXT_PUBLIC_API_URL}event/deletealarms/${alarm.idx}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`
          },
      })
      .then((response) => {
          if (response.status)
          {
              console.log('trying to remove event from alarmList');
              alarmListRemover(alarm);
              alarmCountHandler(false);
              console.log('remove success');
          }
      })
      .catch((err) => {
          console.log('removeEventFromDatabase - api request failed');
          console.log('err is ', err);
      });

  };
  

  useEffect(() => {

      const handleRenderAlarmList = () => {
          console.log('listened render-alarm!!!!');
          handleAlarmRerender();
      };

      socket.on(`render-friend`, handleRenderAlarmList);


      return () => {
          socket.off(`render-friend`, handleRenderAlarmList);
      }
  }, [])

  const denyRequest = (alarm: any) => () => {
      console.log("deny request of - " + alarm.from_nickname);
      console.log('deny - event_type - ', alarm);
      // alarm이 어떤 종류인지
        // 근데 remove할 때는 딱히 다른 동작 필요 없나?
      if (alarm.event_type === 'add_friend')
      {
          console.log('add_friend deny request');
          removeEventFromDatabase(alarm);
      }
      else if (alarm.event_type === 'invite_chat')
      {
          console.log('invite_chat deny request');
          removeEventFromDatabase(alarm);
      }
      else if (alarm.event_type === 'game')
      {
        console.log('invite_game deny request');
          removeEventFromDatabase(alarm);
      }

    // alarmCountHandler(false);
  };

  const handleProfile = (alarm: any) => () => {
    console.log('profile to ' + alarm.from_nickname);
    
    // MTbox를 리렌더링
      // 1이 프로필인데, 형태 조정하는게 나을 듯
    setMTbox(1, alarm.from_nickname);
        // 특정 부분을 리렌더링하는 함수를 객체로 묶어서 props로 전달하는 건 어떨까?
  }
  
  const imageLoader = ({ src }: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }

  // 변경 필요 - friend list의 경우 참조하여 변경

  return (
    <div>
      <List dense
				sx={{
					position: 'absolute',
					top: '10%',
					width: '100%',
					left: '0%',
					maxWidth: '100%',
					maxHeight: '85%',
					overflow: 'auto',
					bgcolor: 'transparent',
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}>
      {alarmList?.length > 0 ? (
          alarmList.map((alarm :any, idx :number) => {
            if (alarm.event_type === 'add_friend') {
              return (
                  <AlarmAddFriend
                    key={idx}
                    alarm={alarm}
                    alarmReducer={alarmReducer}
                    handleProfile={handleProfile}
                    imageLoader={imageLoader}
                    denyRequest={denyRequest}
                    >
                  </AlarmAddFriend>
              );
            } else if (alarm.event_type === 'invite_chat') {
              return (
                  <AlarmInviteChat
                    key={idx}
                    alarm={alarm}
                    alarmReducer={alarmReducer}
                    handleProfile={handleProfile}
                    imageLoader={imageLoader}
                    denyRequest={denyRequest}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    selectedAlarm={selectedAlarm}
                    setSelectedAlarm={setSelectedAlarm}
                  >
                  </AlarmInviteChat>
              );
            } else if (alarm.event_type === 'game') {
              return (
                <AlarmInviteGame
                  ket={idx}
                  alarm={alarm}
                  alarmReducer={alarmReducer}
                  handleProfile={handleProfile}
                  imageLoader={imageLoader}
                  denyRequest={denyRequest}
                  cookies={cookies}
                />
              );
            }
            return null;
          })
          ) : (
            <></>
          )}
      </List>
    </div>
  );
}
