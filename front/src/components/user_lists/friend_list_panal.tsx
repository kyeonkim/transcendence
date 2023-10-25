import { useState } from 'react';
import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

const MainFriendPanal = styled(Box) ({
    position: 'absolute',
    top: 60,
    backgroundColor: 'white'
  })


export default function FriendListPanal (props: any) {
  const {value, index} = props;

  return (
    <List sx={{ width: '100%', height: '100%' ,maxWidth: 1143, maxHeight: 932 ,bgcolor: 'white', overflow: 'auto'}}>
      
    </List>
  );
}