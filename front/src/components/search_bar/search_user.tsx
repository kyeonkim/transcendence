import React from 'react';
import { useState } from 'react';
import axios from 'axios';
// import { UserContext } from '../../pages/main'; 

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';
import { Background } from 'tsparticles-engine';

const MainSearchUser = styled(TextField)({
    position: 'absolute',
    top: '30%',
    left: 0,
    width: '80%',
    height: '4.6%',
    color: "black",
    background: "white",
    borderRadius: '10px',
});

const MainSearchButton = styled(Button) ({
    position: 'absolute',
    top: '30%',
    left: '80%',
    width: '20%',
    height: '4.6%',
    color: "black"
  });

interface SearchUserProps {
    setMTbox: (num: number, searchTarget: string) => void;
}

export default function SearchUser({ setMTbox }: SearchUserProps) {
    const [searchTarget, setSearchTarget] = useState('');
    const cookies = useCookies();

    const handleMTbox =  async (num: number, searchTarget: string) => {
        if (searchTarget) {
            await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${searchTarget}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                  },
            })
                .then((res) => {
                    // console.log(typeof res.data.userData.user_id)
                    if (res.data.status === true)
                        setMTbox(num, searchTarget);
                })
        }
    }

    const handleEnterkey = (e: any) => {
        if (e.key === 'Enter')
            handleMTbox(1, searchTarget);
    }

    return (
        <React.Fragment>
            <MainSearchUser
                id="outlined_search_user"
                label="유저 검색"
                variant="outlined"
                onChange={(e) => setSearchTarget(e.target.value)}
                onKeyDown={handleEnterkey}
                >
            </MainSearchUser>
            <MainSearchButton
                variant='contained'
                onClick={() => handleMTbox(1, searchTarget)}
                >
                검색
            </MainSearchButton>
        </React.Fragment>
    );
}