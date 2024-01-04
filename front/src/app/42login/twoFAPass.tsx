'use client'
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import CookieControl from './cookie_control';
import { useRouter } from 'next/navigation';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';
 

import { useCallback } from 'react';
import particlesOptions from "../particles.json";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const style: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: '24',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '8px',
  left: '80%',
  transform: 'translateX(-50%)',
};

const inputStyle: React.CSSProperties = {
  marginTop: '16px',
  marginBottom: '16px',
};

export default function TwoFAPass ({res}: {res: any}) {
  const { access_token, nick_name, user_id } = res;
  const [isPass, setIsPass] = useState(false);
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [render, setRender] = useState(false);
  const [ init, setInit ] = useState(false);
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => {
        setInit(true);
    });
}, []);

  useEffect(() => {
    const fetchData = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/2fa/pass`, {
          user_id: user_id,
          user_nickname: nick_name,
          code: code,
        },
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
        },
        })
        .then((res) => { 
          if (res.data.status) {
            setResponseData(res.data);
            setIsPass(true);
          }
        })
        .catch((error) => {
        })
    };
    if (code.length === 6) {
      fetchData();
    }
  }, [code]);

  const onClose = () => {
    setOpen(false);
    router.push('/');
  };
  const particlesLoaded = async (container: Container) => {
    // console.log(container);
  };
  return (
    <div>
      {init && <Particles id="tsparticles" options={particlesOptions as ISourceOptions} particlesLoaded={particlesLoaded}/>}
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="Input OTP"
        aria-describedby="Otp text"
      >
        <Box sx={style}>
          <Typography id="Otp text" sx={{ mt: 2, color: 'white'}}>
            OTP 어플을 통해 6자리 코드를 입력해주세요.
          </Typography>
          <Typography id="Otp text" sx={{ mt: 2, color: 'white'}}>
            6자리가 정상적으로 입력되면 자동으로 넘어가집니다!
          </Typography>
          <input
            type="text"
            placeholder="6자리 숫자 입력"
            style={inputStyle}
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
          />
          <div style={closeButtonStyle}>
            <Button variant="contained" onClick={onClose}>닫기</Button>
          </div>
        </Box>
      </Modal>
      {isPass && responseData ? <CookieControl res={responseData} /> : null}
    </div>
  );
}