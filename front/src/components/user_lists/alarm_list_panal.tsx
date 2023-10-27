import { useState } from 'react';
import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

const MainAlarmPanal = styled(Box) ({
    position: 'absolute',
    top: 60,
    backgroundColor: 'white'
  })


export default function AlarmListPanal (props: any) {
    
    // 1차 렌더링을 할 때, 남은 알람을 모두 가져와서 렌더링하고, state에 저장.
        // 백에서 저장할 필요 있음 + 백에서 받아오기 위한 GET API 필요함

    // event를 받아서 자체적으로 리스트를 추가 - back에서 따로 저장하고 넘겨줄 것으로 보임

    // const [AlarmList, setAlarmList] = useState<any>([]);
        // any 대신 array 같은 타입을 선언할 수도 있나?

    // eventHandler들을 줄 세우기 위한 state
        // 동기화 방법론 찾기

    const {value, index, alarmCountHandler} = props;

    return (
    <div
        hidden={value !== index}
    >
        {value === index && (
            <MainAlarmPanal sx={{ p: 2 }}>
            <Typography>
                test for text is changed. It is Alarm List Panal.
                <Button variant="contained" onClick={alarmCountHandler}>Hello world</Button>
            </Typography>
            </MainAlarmPanal>
        )}
    </div>
    );
}