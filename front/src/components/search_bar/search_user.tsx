import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Skeleton from '@mui/material/Skeleton';

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
            await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${searchTarget}`, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                },
            })
                .then((res) => {

                    if (res.data.status === true)
                        setMTbox(num, searchTarget);
                })
        }
    }

    const handleEnterkey = (e: any) => {
        if (e.key === 'Enter')
        {
            if (/^[a-zA-Z0-9]+$/.test(searchTarget))
                handleMTbox(1, searchTarget);
            else
                setval(false);
        }
    }

    return (
        <>
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
                    position: 'absolute',
                    top: '35%',
                    zIndex: 9999,
                    transform: 'translate(0, 0)',
                }}
            >
                <strong>영문 숫자만 입력해주세요!</strong>
            </Alert>}
        </>
    );
}