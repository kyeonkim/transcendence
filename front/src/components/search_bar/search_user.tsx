import React from 'react';
import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';


const MainSearchUser = styled(TextField) ({
  position: 'absolute',
  top: 100,
  left: 0,
  width: 350,
  height: 0,
  color: "black"
});

const MainSearchButton = styled(Button) ({
    position: 'absolute',
    top: 100,
    left: 350,
    width: 50,
    height: 50,
    color: "black"
  });


export default function SearchUser() {
    
    const [searchTarget, setSearchTarget] = useState('');

    const doSearchTarget = () => {
        if (searchTarget == 'true')
        {
            alert("it's true!");
        }
        else
        {
            alert("it's not true!");
        }
    }

    // searchTarget을 MainSearchUser에서 갱신
    return (
        <React.Fragment>
            <MainSearchUser id="outlined_search_user" label="유저 검색" variant="outlined" onChange={(e) => setSearchTarget(e.target.value)}>
                Matching
            </MainSearchUser>
            <MainSearchButton variant='contained' onClick={doSearchTarget}>
                Search
            </MainSearchButton>
        </React.Fragment>
    );
}