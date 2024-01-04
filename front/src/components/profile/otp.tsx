'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';

const style: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: '24',
  backgroundColor: 'white',
};

const qrCodeStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px solid #000',
  padding: '16px',
  width: '200px',
  height: '200px',
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

export default function OtpModal({ open, isActivated, setActive, onClose, myId, myNick, token }: { open: boolean, isActivated: boolean,setActive: (value: boolean) => void, onClose: () => void, myId: number, myNick: string, token: string }) {
  const [url, setURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState('');
  const [key, setKey] = useState('');

  const cookies = useCookies();

  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}auth/2fa/activeqr`,
          {
            user_id: myId,
            user_nickname: myNick,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.get('access_token')}`,
            },
          }
        );

        if (response.data.status) {
          setURL(response.data.otpauthUrl);
          setKey(response.data.secret);
        }
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleActivate2FA = async () => {
    // console.log('in opt', myId, myNick);
    await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}auth/2fa/active`,
      {
        user_id: myId,
        user_nickname: myNick,
        code: code,
        secret: key,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('access_token')}`,
          },
        })
        .then((res) => {
          if (res.data.status)
          {
            setActive(true);
            onClose();
          }
        })
  };

  const handleRmove2FA = async () => {

    await axiosToken.delete(`${process.env.NEXT_PUBLIC_API_URL}auth/2fa/deactive`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('access_token')}`,
          },
          data: {
            user_id: myId,
            user_nickname: myNick,
            code: code,
          }
        })
        .then((res) => {

          if (res.data.status)
          {
            setActive(false);
            onClose();
          }
        })
  };

  const handleEnterkey = (e: any) => {
    if (e.key === 'Enter') {
      if (isActivated)
        handleRmove2FA();
      else
        handleActivate2FA();
    }
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="Set OTP"
        aria-describedby="Otp text"
      >
        <Box sx={style}>
          <Typography id="OTP" variant="h6" component="h2">
            QR code
          </Typography>
          {isActivated ? (
            <>
              <Typography id="Otp text" sx={{ mt: 2 }}>
                OTP를 비활성화 하실려면 6자리 코드를 입력해주세요.
              </Typography>
              <input
                type="text"
                placeholder="6자리 숫자 입력"
                style={inputStyle}
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleEnterkey}
              />
              <div style={closeButtonStyle}>
                <Button variant="contained" onClick={onClose}>닫기</Button>
              </div>
            </>
          ) : (
            <>
              <div style={qrCodeStyle}>
                <QRCode value={url} />
              </div>
              <Typography id="Otp text" sx={{ mt: 2 }}>
                OTP 어플을 통해 등록하고 6자리 코드를 입력해주세요.
              </Typography>
              <input
                type="text"
                placeholder="6자리 숫자 입력"
                style={inputStyle}
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleEnterkey}
              />
              <div style={closeButtonStyle}>
                <Button variant="contained" onClick={onClose}>닫기</Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}