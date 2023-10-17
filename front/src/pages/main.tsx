import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// ThemeProvider - app 전역에 적용할 수 있음.
import { ThemeProvider } from '@mui/system';
import theme from "../util/theme/theme"

import MyProfile from '@/components/profile/my_profile';
import MatchingButton from '@/components/matching/matching';
import ChatRoomButton from '@/components/chat_room/chat_room_button';
import SearchUser from '@/components/search_bar/search_user';
import UserLists from '@/components/user_lists/user_lists';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// import Button from '@mui/material/Button';
// import  Notlogin  from '../components/notlogin';

//mainbox
import Mainbox from '../components/mainbox';

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
  top: 650,
  left: 0,
  width: 400,
  height:682,
  position: 'absolute'
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
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
  const [clicked, setClick] = useState(0);
  const [id, setSearch] = useState('');
  const { access_token, refresh_token } = router.query;
  let   isLoggedIn = true;
  let   contentComponent;

  const setCookieHandler = () => {
    if (access_token && refresh_token) {
    setCookie('access_token', access_token, {
      path: '/',
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
      httpOnly: true
    });
    setCookie('refresh_token', refresh_token, {
      path: '/',
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
      httpOnly: true
    });
    console.log('access_token:', access_token);
    console.log('refresh_token:', refresh_token);
  }
  }

  const handleClick = (value: number, searchTarget: string) => {
    setClick(value);
    setSearch(searchTarget);
  }

  useEffect(() => {
      setCookieHandler();
  }, [router.query]);

  return (
      //  <UserContext.Consumer>
        <React.Fragment>
          <CssBaseline />
          {/* <Container> */}
            <TLBox>
              <MyProfile setMTbox={handleClick}/>
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
          {/* </Container> */}
        </React.Fragment>
      // </UserContext.Consumer>
    )
  }
  