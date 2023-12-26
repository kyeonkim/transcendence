'use client'
import { useState, useEffect } from 'react';
import React from 'react';

import List from '@mui/material/List';

import Box from '@mui/material/Box';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// get cookie
import { useCookies } from 'next-client-cookies';
import { useChatSocket } from "@/app/main_frame/socket_provider";

import AlarmAddFriend from './alarm_add_friend';
import AlarmInviteChat from './alarm_invite_chat'
import AlarmInviteGame from './alarm_invite_game'
import { axiosToken } from '@/util/token';

import { useMainBoxContext } from '@/app/main_frame/mainbox_context';
import { useUserDataContext } from '@/app/main_frame/user_data_context';

export default function AlarmListPanal (props: any) {
	const [openModal, setOpenModal] = useState(false);
	const [selectedAlarm, setSelectedAlarm] = useState(-1);

  const cookies = useCookies();
  const socket = useChatSocket();

  const alarmList = props.alarmList;
  const alarmListRemover = props.alarmListRemover;
  const alarmCountHandler = props.alarmCountHandler;
  const handleAlarmRerender = props.handleAlarmRerender;
  const handleDmAlarmCount = props.handleDmAlarmCount;
  // const setDm = props.setAlarmDM
  const { setMTBox } = useMainBoxContext();
  const { clicked } = useUserDataContext();


  const alarmReducer = (alarm :any) => {

      alarmListRemover(alarm);
      alarmCountHandler(false);
  }

  const removeEventFromDatabase = async (alarm: any) => {
      await axiosToken.delete(`${process.env.NEXT_PUBLIC_API_URL}event/deletealarms/${alarm.idx}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`
          },
      })
      .then((response) => {
        // console.log('remove event from database - res : ', response);
          if (response.status)
          {
              // console.log('remove event from front state');
              alarmListRemover(alarm);
              alarmCountHandler(false);
          }
      })
  };



  // useEffect(() => {

	// 	const dmAlarmListener = (data :any) => {
	// 		handleDmAlarmCount(data.from_id, true);
	// 	}

	// 	socket.on('dm', dmAlarmListener);
	// 	return () => {
	// 		socket.off('dm', dmAlarmListener);
	// 	}
	// }, [socket]);



  useEffect(() => {

      const handleRenderAlarmList = (data: any) => {
        // console.log('render alarm list');
          handleAlarmRerender(data.data);
      };

      socket.on(`render-friend`, handleRenderAlarmList);


      return () => {
          socket.off(`render-friend`, handleRenderAlarmList);
      }
  }, [])


  const denyRequest = (alarm: any) => () => {

    // console.log('deny request remove event from database', alarm);

      if (alarm.event_type === 'add_friend')
      {
          removeEventFromDatabase(alarm);
      }
      else if (alarm.event_type === 'invite_chat')
      {
          removeEventFromDatabase(alarm);
      }
      else if (alarm.event_type === 'game')
      {
          removeEventFromDatabase(alarm);
      }
  };

  const handleProfile = (alarm: any) => () => {   

    setMTBox(1, alarm.from_nickname);

  }
  
  const imageLoader = ({ src }: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }

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
                  key={idx}
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
