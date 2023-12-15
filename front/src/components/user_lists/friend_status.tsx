import { useState, useEffect } from "react";
import { useChatSocket } from "@/app/main_frame/socket_provider";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { axiosToken } from '@/util/token';
import { useStatusContext } from "@/app/main_frame/status_context";

export function useFriendList(myId: any) {
  const [apiResponse, setApiResponse] = useState([]);
  const socket = useChatSocket();
  const cookies = useCookies();
  const statusContext = useStatusContext();

  useEffect(() => {
    const fetchData = async () => {
        await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}social/getFriendList/${myId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('access_token')}`
          },
        })
        .then((response) => {
          // console.log('friend list response ', response.data);
          if (response.data.status) {
            const newResponse = response.data.data.map((user: any) => {
              user.status = 'offline';
              return user;
            });
            setApiResponse(newResponse);
          } else {
            setApiResponse([]);
          }
        })
        .catch((err) => {

        });
    };

    const handleRenderFriend = (data :any) => {
      fetchData();
    };

    socket.on(`render-friend`, handleRenderFriend);

    fetchData();

    return () => {
      socket.off(`render-friend`, handleRenderFriend);
    };
  }, [myId, socket]);

  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      updateStatus(data.user_id, data.status);
    };

    socket.on('status', handleStatusUpdate);
    return () => {
      socket.off('status', handleStatusUpdate);
    };
  }, [apiResponse, socket]);

  const updateStatus = (userId: any, status: any) => {
    setApiResponse((prevState) =>
      prevState.map((user: any) => {
        if (user.followed_user_id == Number(userId)) {
          return { ...user, status };
        }
        return user;
      })
    );
    if (statusContext === 'login') {
      // 내 상태를 보낸다.
      socket.emit('status', { user_id: myId, status: 'online', target: userId });
    }
    else
      socket.emit('status', { user_id: myId, status: statusContext, target: userId });

  };

  return apiResponse;
}
