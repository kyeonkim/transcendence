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

import axios from 'axios';

import AlarmAddFriend from './alarm_add_friend';
import AlarmInviteChat from './alarm_invite_chat'

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

  const alarmList = props.alarmList;
  const alarmListRemover = props.alarmListRemover;
  const alarmCountHandler = props.alarmCountHandler;
  const setMTbox = props.setMTbox;

  const alarmReducer = (alarm :any) => {
      alarmListRemover(alarm);
      alarmCountHandler(false);
  }

  const removeEventFromDatabase = async (alarm: any) => {
        
        
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}event/deletealarms/${alarm.idx}`)
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
      });

  };
  

  const denyRequest = (alarm: any) => () => {
      console.log("deny request of - " + alarm.from_nickname);
      console.log('deny - type - ', alarm);
      // alarm이 어떤 종류인지
        // 근데 remove할 때는 딱히 다른 동작 필요 없나?
      if (alarm.type === 'add_friend')
      {
          removeEventFromDatabase(alarm);
      }
      else if (alarm.event_type === 'invite_chat')
      {
          console.log('invite_chat deny request');
          removeEventFromDatabase(alarm);
      }
      // else if (alarm.type === 'game')
      // {
      //     removeEventFromDatabase(alarm);
      // }

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


  return (
    <div>
      {alarmList ? (
        <List dense sx={{ width: '100%', maxWidth: 400, maxHeight: 580,bgcolor: 'background.paper', overflow: 'auto'}}>
          {alarmList.map((alarm :any, idx :number) => {
            if (alarm.event_type === 'add_friend')
            {
              console.log('alarm data - ', alarm);
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
            }
            else if (alarm.event_type === 'invite_chat')
            {
              console.log('alarm data - ', alarm);
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
            }
            // else if (alarm.event_type === 'game')
            // {
            //   return (
            //     <ListItem
            //       key={alarm.from_nickname}
            //       disablePadding
            //     >
            //     <SportsTennisIcon />
            //       <ListItemButton onClick={handleProfile(alarm)}>
            //           <ListItemAvatar>
            //           <Avatar
            //             src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
            //           />
            //           </ListItemAvatar>
            //           <ListItemText id={labelId} primary={`${alarm.from_nickname}`} />
            //       </ListItemButton>
            //       <IconButton onClick={acceptGameRequest(alarm)}>
            //           <CheckCircleOutlineRoundedIcon />
            //       </IconButton>
            //       <IconButton onClick={denyRequest(alarm)}>
            //           <ClearRoundedIcon />
            //       </IconButton>
            //     </ListItem>
            //   );
            // }
          })}
        </List>
      ) : (
        <p>알람이 없습니다.</p>
      )}
    </div>
  );
}


// 'use client'
// import { useState, useEffect } from 'react';
// import React from 'react';

// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';

// import IconButton from '@mui/material/IconButton';
// import Avatar from '@mui/material/Avatar';
// import CommentIcon from '@mui/icons-material/Comment';

// import HandshakeIcon from '@mui/icons-material/Handshake';
// import AddCommentIcon from '@mui/icons-material/AddComment';
// import SportsTennisIcon from '@mui/icons-material/SportsTennis';

// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';

// import Button from '@mui/material/Button';

// import Modal from '@mui/material/Modal';
// import TextField from '@mui/material/TextField';

// import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
// import ClearRoundedIcon from '@mui/icons-material/ClearRounded';


// // 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
// import Skeleton from '@mui/material/Skeleton';

// // styled component (컴포넌트 고정 style로 보임)
// import { styled } from '@mui/system';

// // get cookie
// import { useCookies } from 'next-client-cookies';

// import axios from 'axios';

// // Queue Library
// // import Bull from 'bull';


// const MainAlarmPanal = styled(Box) ({
//     position: 'absolute',
//     top: 60,
//     backgroundColor: 'white'
//   })

// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   opacity: 0.5
//   };

// export default function AlarmListPanal (props: any) {
//   const cookies = useCookies();


//   const alarmList = props.alarmList;
//   const alarmListRemover = props.alarmListRemover;
//   const alarmCountHandler = props.alarmCountHandler;
//   const setMTbox = props.setMTbox;

//   const alarmReducer = () => {
//       alarmListRemover(alarm);
//       alarmCountHandler(false);
//   }

//   const removeEventFromDatabase = async (alarm: any) => {
        
        
//       await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}event/deletealarms/${alarm.id}`)
//       .then((response) => {
//           if (response.status)
//           {
//               console.log('trying to remove event from alarmList');
//               alarmListRemover(alarm);
//               alarmCountHandler(false);
//               console.log('remove success');
//           }
//       })
//       .catch((err) => {
//           console.log('removeEventFromDatabase - api request failed');
//       });

//   };

//   const acceptFriendAddRequest = async (alarm: any) => {

//       console.log ('acceptFriendAddRequest - ', alarm)
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}social/acceptfriend`,
//       {
//         "event_id": alarm.idx,
//         "user_id": alarm.to_id,
//         "user_nickname": cookies.get('nick_name'),
//         "friend_id": 0,
//         "friend_nickname": alarm.from_nickname
//       })
//       .then((response) => {
//         console.log('accept event res=====',response)
//           if (response.status)
//           {
//               console.log('trying to remove event from alarmList');
//               alarmListRemover(alarm);
//               alarmCountHandler(false);
//               console.log('remove success');
//           }
//       })
//       .catch((err) => {
//           console.log('accepFriendAddRequest - api request failed');
//       });
//   }
  
//   const acceptChatAmIinChat = async (alarm :any) => {
//       await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/id/${alarm.to_id}`)
//       .then((response) => {
//           if (response.data.userData.roomuser === null)
//           {
//               // 방 들어가기
//               chatRequestJoinRoom(
//                   response.data.userData.roomuser.is_password,
//                   response.data.userData.roomuser.idx);              
//           }
//           else
//           {
//               // 이미 채팅방에 들어가있습니다!
//               // 예외 처리
//               // 일단 아무것도 안함
//           }
//       })
//   };

//   const chatRequestJoinRoom = (ispassword :boolean, idx :number) => {
//     // password 존재 여부

//     // alarm event id 동봉 필요

//     if (ispassword === true)
//     {
//         // 존재할 경우 - modal

//     }
//     else
//     {
//         // 존재하지 않을 경우 - join

//     }
//   };

//   const acceptFriendRequest = (alarm: any) => () => {
//       console.log("accept request of - " + alarm.from_nickname);

//       acceptFriendAddRequest(alarm);

//   };

//   const acceptChatRequest = (alarm :any) => () => {
//       acceptChatAmIinChat(alarm);
//   };

//   // const acceptGameRequest = (alarm :any) => () => {

//   // };

//   const denyRequest = (alarm: any) => () => {
//       console.log("deny request of - " + alarm.from_nickname);

//       // alarm이 어떤 종류인지
//         // 근데 remove할 때는 딱히 다른 동작 필요 없나?
//       if (alarm.type === 'add_friend')
//       {
//           removeEventFromDatabase(alarm);
//       }
//       else if (alarm.type === 'invite_chat')
//       {
//           removeEventFromDatabase(alarm);
//       }
//       // else if (alarm.type === 'game')
//       // {
//       //     removeEventFromDatabase(alarm);
//       // }

//     // alarmCountHandler(false);
//   };

//   const handleProfile = (alarm: any) => () => {
//     console.log('profile to ' + alarm.from_nickname);
    
//     // MTbox를 리렌더링
//       // 1이 프로필인데, 형태 조정하는게 나을 듯
//     setMTbox(1, alarm.from_nickname);
//         // 특정 부분을 리렌더링하는 함수를 객체로 묶어서 props로 전달하는 건 어떨까?
//   }
  
//   const imageLoader = ({ src }: any) => {
//     return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
//   }
  
//   return (
//     <div>
//       {alarmList ? (
//         <List dense sx={{ width: '100%', maxWidth: 400, maxHeight: 580,bgcolor: 'background.paper', overflow: 'auto'}}>
//           {alarmList.map((alarm :any) => {
//             const labelId = `comment-list-secondary-label-${alarm.from_nickname}`;
//             console.log('alamr type - ', alarm);
//             if (alarm.event_type === 'add_friend')
//             {
//               return (
//                 <ListItem
//                   key={alarm.from_nickname}
//                   disablePadding
//                 >
//                   <HandshakeIcon />
//                   <ListItemButton onClick={handleProfile(alarm)}>
//                       <ListItemAvatar>
//                       <Avatar
//                         src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
//                       />
//                       </ListItemAvatar>
//                       <ListItemText id={labelId} primary={`${alarm.from_nickname}`} />
//                   </ListItemButton>
//                   <IconButton onClick={acceptFriendRequest(alarm)}>
//                       <CheckCircleOutlineRoundedIcon />
//                   </IconButton>
//                   <IconButton onClick={denyRequest(alarm)}>
//                       <ClearRoundedIcon />
//                   </IconButton>
//                 </ListItem>
//               );
//             }
//             else if (alarm.event_type === 'invite_chat')
//             {
//               return (
//                 <ListItem
//                   key={alarm.from_nickname}
//                   disablePadding
//                 >
//                   <AddCommentIcon />
//                   <ListItemButton onClick={handleProfile(alarm)}>
//                       <ListItemAvatar>
//                       <Avatar
//                         src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
//                       />
//                       </ListItemAvatar>
//                       <ListItemText id={labelId} primary={`${alarm.from_nickname}`} />
//                   </ListItemButton>
//                   <IconButton onClick={acceptChatRequest(alarm)}>
//                       <CheckCircleOutlineRoundedIcon />
//                   </IconButton>
//                   <IconButton onClick={denyRequest(alarm)}>
//                       <ClearRoundedIcon />
//                   </IconButton>
//                 </ListItem>
//               );
//             }
//             // else if (alarm.event_type === 'game')
//             // {
//             //   return (
//             //     <ListItem
//             //       key={alarm.from_nickname}
//             //       disablePadding
//             //     >
//             //     <SportsTennisIcon />
//             //       <ListItemButton onClick={handleProfile(alarm)}>
//             //           <ListItemAvatar>
//             //           <Avatar
//             //             src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
//             //           />
//             //           </ListItemAvatar>
//             //           <ListItemText id={labelId} primary={`${alarm.from_nickname}`} />
//             //       </ListItemButton>
//             //       <IconButton onClick={acceptGameRequest(alarm)}>
//             //           <CheckCircleOutlineRoundedIcon />
//             //       </IconButton>
//             //       <IconButton onClick={denyRequest(alarm)}>
//             //           <ClearRoundedIcon />
//             //       </IconButton>
//             //     </ListItem>
//             //   );
//             // }
//           })}
//         </List>
//       ) : (
//         <p>알람이 없습니다.</p>
//       )}
//     </div>
//   );
// }
