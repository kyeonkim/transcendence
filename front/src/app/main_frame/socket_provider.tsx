'use client'
import React, { memo, createContext, useContext, useEffect, useState } from 'react';
import { Socket } from "socket.io-client"
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies"
import { io } from "socket.io-client";
import { axiosToken } from '@/util/token';

const ChatSocketContext = createContext<Socket>(null);


export const useChatSocket = () => {
  return useContext(ChatSocketContext);
};

export function ChatSocket ({ children, my_name, my_id }: any) {
  const cookies = useCookies();
  const route = useRouter();
  const [socket, setSocket] = useState<Socket>();

  
  // console.log('in socket compo==',my_id);


    useEffect(() => {
          // let tmpSocket : any;
          // if(my_id) {
            // console.log('my_id - ', my_id.toString());
            // console.log('access_token - ', cookies.get('access_token'));
            // setPrevUserId(userId);
            const tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
            {
              query: {
                  user_id: my_id,
              },
              extraHeaders: {
                  token: cookies.get('access_token'),
              },
            });
            // console.log('tmpSocket - ', tmpSocket);
  
            tmpSocket.on("connect" , () => {
                // console.log('socket connected');
            })
          
            tmpSocket.on("disconnect", () => {
              // console.log("서버와 연결이 끊김");
              // check
              route.replace("/");
              window.alert('서버와 연결이 끊어졌습니다.');
            });
  
            setSocket(tmpSocket);
          // }

          return () => {
            if (tmpSocket)
              tmpSocket.disconnect();
          }

      }, []);
    
    useEffect(() => {
      // console.log("before socket : ", socket);
      if (socket)
      {
        // console.log("after socket : ", socket);
        // console.log('socket ready');
      }
    }, [socket])


  return (
    <div>
      {socket && 
          <ChatSocketContext.Provider value={socket}>
            {children}
          </ChatSocketContext.Provider>
      }
    </div>
  );
}

export const memoChatSocket = memo(ChatSocket);

export default ChatSocket;


