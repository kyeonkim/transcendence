import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const qrCodeStyle = {
  display: 'flex', // QR 코드를 가로로 배치
  flexDirection: 'column', // QR 코드를 세로로 배치
  alignItems: 'center',  // 가운데 정렬
  border: '2px solid #000', // QR 코드 테두리 스타일
  padding: '16px', // QR 코드 내부 여백 조정
  width: '300px', // QR 코드의 가로 크기 조정
  height: '300px', // QR 코드의 세로 크기 조정
};

const closeButtonStyle = {
  position: 'absolute', // 아래로 이동
  bottom: '8px', // 아래 여백 조정
  left: '80%', // 가운데 배치
  transform: 'translateX(-50%)', // 가운데로 정렬
};

export default function OtpModal({ open, onClose, myId, myNick, token }: { open: boolean, onClose: () => void, myId: number, myNick: string, token: string }) {
  const [url, setURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	  console.log('in otp page');
    const fetchData = async () => {

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/2fa/activeqr`,
          {
            user_id: myId,
            user_nickname: myNick,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        console.log('in otp page====', response);
        if (response.data.status) {
          setURL(response.data.otpauthUrl);
        }
      } catch (error) {
        console.error('에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <div style={qrCodeStyle}>
                <QRCode value={url} />
              </div>
              <Typography id="Otp text" sx={{ mt: 2 }}>
                OTP 어플을 통해 등록해주세요!!!
              </Typography>
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
