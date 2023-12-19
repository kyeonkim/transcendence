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

      // api로 nickname 가져오기
      let user_id;

      let tmpSocket :any;

      const fetchUserData = async () => {
        await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/mydata`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('access_token')}`
            },        
        }) 
        .then((res) => {
            if (res.data.status === true)
            {
                user_id = res.data.user_id;

                tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
                {
                  query: {
                      user_id: user_id,
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

            }
        })
      }

      fetchUserData();


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


