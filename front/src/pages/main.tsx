'use client'
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// ThemeProvider - app 전역에 적용할 수 있음.
import { ThemeProvider } from '@mui/system';
import theme from "../util/theme/theme"

import MyProfile from '@/components/profile/my_profile';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// import Button from '@mui/material/Button';
// import  Notlogin  from '../components/notlogin';


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
  backgroundColor: 'black',
  top: 400,
  left: 0,
  width: 400,
  height:400,
  position: 'absolute'
});

// Bottom Left Box
const BLBox = styled(Box) ({
  backgroundColor: 'green',
  top: 800,
  left: 0,
  width: 400,
  height:400,
  position: 'absolute'
});

// Middle Top Box
const MTBox = styled(Box) ({
  backgroundColor: 'skyblue',
  top: 0,
  left: 400,
  width: 1600,
  height: 1200,
  position: 'absolute'
});




export default function Main() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);

  const { access_token, refresh_token } = router.query;
  let   isLoggedIn = true;
  let   contentComponent;

  // 새로 고침하면 토큰 비어버리는 것처럼 보임.
  // query가 사라지나?
  // 아니면 다른 이유?
  // router.push할 때 표기되는 주소를 변경해서 그런 것으로 추측됨.

  // 이미 token cookie가 있을 때, 또 setCookie를 하면 어떻게 되는가? 

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

  // isLoggedIn에 따라 다른 걸 보여주는 방식?

  // 왜 useEffect는 한 번 값 없이 rendering하는가?

  useEffect(() => {
      setCookieHandler();
  }, [router.query]);

  return (
      <React.Fragment>
        {/* <ThemeProvider theme={theme}> */}
          <CssBaseline />
          <Container maxWidth="xs">
            <TLBox>
              <MyProfile />
            </TLBox>
            <MTBox>
              
            </MTBox>
            <MLBox>

            </MLBox>
            <BLBox>
              
            </BLBox>
          </Container>
        {/* </ThemeProvider> */}
          {/* <h1>Main</h1> */}
      </React.Fragment>
    )
  }
  