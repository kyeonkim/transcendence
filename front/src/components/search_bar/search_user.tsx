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
import { Alert, AlertTitle, Grid, Stack, Typography } from '@mui/material';
import styles from './search_bar.module.css';


interface SearchUserProps {
    setMTbox: (num: number, searchTarget: string) => void;
}

export default function SearchUser({ setMTbox }: SearchUserProps) {
    const [searchTarget, setSearchTarget] = useState('');
    const [val, setval] = useState(true);
    const cookies = useCookies();

    const handleMTbox =  async (num: number, searchTarget: string) => {
        if (searchTarget) {
            setval(/^[a-zA-Z0-9]+$/.test(searchTarget));
            console.log('searchTarget - ', searchTarget, val);
            if (val) {
                await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${searchTarget}`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.get('access_token')}`
                    },
                })
                    .then((res) => {
                        console.log('userData in chat==',res);
                        if (res.data.status === true)
                            setMTbox(num, searchTarget);
                    })
            }
            else {
            }
        }
    }

    const handleEnterkey = (e: any) => {
        if (e.key === 'Enter')
            handleMTbox(1, searchTarget);
    }

    return (
        <Grid item className={styles.search_bar}>
            <TextField
                className={styles.search_user}
                id="outlined_search_user"
                label="유저 검색"
                variant="outlined"
                onChange={(e) => setSearchTarget(e.target.value)}
                onKeyDown={handleEnterkey}
                focused
                sx={{input: {color: 'white'}}}
                >
            </TextField>
            {!val && <Alert
                severity="error"
                onClose={() => {setval(true)}}
                sx={{
                    position: 'fixed',
                    top: '110%',
                    left: '5%',
                    zIndex: 9999,
                    transform: 'translate(0, 0)',
                }}
            >
                <strong>영문 숫자만 입력해주세요!</strong>
            </Alert>}
        </Grid>
    );
}