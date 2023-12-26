import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Skeleton from '@mui/material/Skeleton';

import { styled } from '@mui/system';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';
import { Alert, AlertTitle, Grid, Stack, Typography } from '@mui/material';
import styles from './search_bar.module.css';

import { useMainBoxContext } from '@/app/main_frame/mainbox_context';


export default function SearchUser() {
    const [searchTarget, setSearchTarget] = useState('');
    const [errMesaage, setErrorMessage] = useState('');
    const [val, setval] = useState(true);
    const cookies = useCookies();

    const { setMTBox } = useMainBoxContext();

    const handleMTbox =  async (num: number, searchTarget: string) => {
        if (searchTarget) {
            await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${searchTarget}`, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                },
            })
                .then((res) => {
                    if (res.data.status === true)
                        setMTBox(num, searchTarget);
                    else {
                        setval(false);
                        setErrorMessage('유효하지 않는 유저입니다')
                    }
                })
        }
    }

    const handleEnterkey = (e: any) => {
        if (e.key === 'Enter')
        {
            if (/^[a-zA-Z0-9]+$/.test(searchTarget))
                handleMTbox(1, searchTarget);
            else
            {
                setval(false);
                setErrorMessage("닉네임은 영문, 숫자만 입력해 주세요!");
            }
        }
    }

    return (
        <>
            <TextField
                className={styles.search_user}
                id="outlined_search_user"
                label="유저 검색"
                variant="outlined"
                onChange={(e) => {
                    setval(true);
                    setSearchTarget(e.target.value)
                }}
                onKeyDown={handleEnterkey}
                focused
                sx={{input: {color: 'white'}}}
                >
            </TextField>
            {!val && <Alert
                severity="error"
                sx={{
                    position: 'absolute',
                    top: '35%',
                    zIndex: 9999,
                    transform: 'translate(0, 0)',
                }}
            >
                <strong>{errMesaage}</strong>
            </Alert>}
        </>
    );
}