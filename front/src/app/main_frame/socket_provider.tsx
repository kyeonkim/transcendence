'use client'
import React, { memo, createContext, useContext, useEffect, useState } from 'react';
import { Socket } from "socket.io-client"
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies"
import { io } from "socket.io-client";
import { redirect } from 'next/navigation';


const ChatSocketContext = createContext<Socket>(null);


export const useChatSocket = () => {
  return useContext(ChatSocketContext);
};

export function ChatSocket ({ children }: any) {
  const cookies = useCookies();
  const route = useRouter();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {

      const tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
      {
        query: {
            user_id: cookies.get('user_id'),
        },
        extraHeaders: {
            token: cookies.get('access_token'),
        },
      });

      tmpSocket.on("connect" , () => {

      })
    
      tmpSocket.on("disconnect", () => {
        console.log("서버와 연결이 끊김");
        // route.replace("/");
        // window.alert('서버와 연결이 끊어졌습니다.');
      });

      setSocket(tmpSocket);

      return () => {
          tmpSocket.disconnect();
      }
  
  }, []);

  return (
    <ChatSocketContext.Provider value={socket}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export const memoChatSocket = memo(ChatSocket);

export default ChatSocket;


