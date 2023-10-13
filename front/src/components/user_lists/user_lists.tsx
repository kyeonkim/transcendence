import { useState } from 'react';
import React from 'react';


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

import ChannelListPanal from './channel_list_panal';
import FriendListPanal from './friend_list_panal';
import UserListPanal from './user_list_panal';



const MainUserLists = styled(Tabs) ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 400,
  height: 50,
  color: "black"
});

const MainListSelected = styled(Tab) ({
  
})


//aria-controls - 즉시 관련 하위 요소로 이동시켜주는 역할 (화면 복잡할 때, 즉시 포커스 전환)
function indexProps(index: number) {
    return {
      id: `tab-${index}`,
      'aria-controls': `simple-tab-${index}`
    };
  }

export default function UserLists() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <MainUserLists value={value} onChange={handleChange} aria-label="basic Tabs example">
                <MainListSelected label="Channel" {...indexProps(0)} />
                <MainListSelected label="Friend" {...indexProps(1)} />
                <MainListSelected label="User" {...indexProps(2)} />
            </MainUserLists>
        <ChannelListPanal value={value} index={0}>
        </ChannelListPanal>
        <FriendListPanal value={value} index={1}>
        </FriendListPanal>
        <UserListPanal value={value} index={2}>
        </UserListPanal>
        </React.Fragment>
    );
}