import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// item component의 의미는?

import { io } from "socket.io-client";

import { useCookies } from "next-client-cookies"

import { useWebSocket } from "../../app/main_frame/socket_provider"

import { useContext } from 'react';

const MainTestWebsocket = styled(Grid) ({
    // backgroundColor: 'yellow',
    // top: 0,
    // left: 2000,
    // width: 560,
    // height: 1332,
    position: 'absolute'
});

export default function TestWebsocket() {

    const cookies = useCookies();

    const socket = useWebSocket();

    const sendMessage = () => {
        socket.emit("chat", {message: "test from global socket"});

    };

    
    // const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    // const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
    //     auth: {
    //         token: `Bearer ${cookies.get('refresh_token')}`
    //     },
    //     query: {
    //         user_id: 103895,
    //         nickname: "kshim"
    //     }
    // });
    
    // socket.on("connect", () => {
    //     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    //   });

    // socket.emit("events", {test: "from client", });

    return (
        <MainTestWebsocket container rowSpacing={1} columnSpacing={1}>
            <Button
                variant='contained'
                onClick={sendMessage}>
                    Send Message </Button>
        </MainTestWebsocket>
    );
}