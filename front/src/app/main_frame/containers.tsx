'use Client'

import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// ThemeProvider - app 전역에 적용할 수 있음.
import { ThemeProvider } from '@mui/system';
import theme from "../../util/theme/theme"

import MyProfile from '@/components/profile/my_profile';
import MatchingButton from '@/components/matching/matching';
import SearchUser from '@/components/search_bar/search_user';
import UserLists from '@/components/user_lists/user_lists';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// import Button from '@mui/material/Button';
// import  Notlogin  from '../components/notlogin';

//mainbox
import Mainbox from '../../components/mainbox';

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


export default function Main( props:any ) {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
  const [clicked, setClick] = useState(0);
  const [id, setSearch] = useState('');
  const { access_token, refresh_token } = router.query;
  let   isLoggedIn = true;
  let   contentComponent;

  // 새로 고침하면 토큰 비어버리는 것처럼 보임.
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


// 10-13 kshim Button의 기능이 main에 위치해있어서 좀 이상하다는 느낌 받았던 것 같습니다.
// MyProfile Component 파일 안에서 동작을 수행하고 그 결과를 main의 state에 반영시키는 구조가 더 개인적인 취향에 맞긴한데, 그 경우 수행 결과를 state로 전달하는 방법을 알아야할 것 같습니다.

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
          <Container maxWidth="xs">
            <TLBox>
              <MyProfile setMTbox={handleClick}/>
            </TLBox>
            <MTBox>
              <Mainbox mod={clicked} search={id}/>
            </MTBox>
            <MLBox>
              <SearchUser setMTbox={handleClick}/>
              <MatchingButton />
            </MLBox>
            <BLBox>
              <UserLists />
            </BLBox>
          </Container>
        </React.Fragment>
      // </UserContext.Consumer>
    )
  }
  