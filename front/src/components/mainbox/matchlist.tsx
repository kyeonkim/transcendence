'use client';
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useCookies } from 'next-client-cookies';
import { axiosToken } from '@/util/token';

export default function MatchList(props: any) {
  const [page, setPage] = useState(0);
  const [res, setRes] = useState<any>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const userNickname = props.id;
  const cookies = useCookies();

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current && listRef.current.clientHeight + listRef.current.scrollTop === listRef.current.scrollHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
    await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}game/data`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('access_token')}`
      },
      params: { id: 0, index: res.length ? res[res.length - 1].idx - 1 : 0 },
    })
    .then((response) => {
      if (response.data.status)
        setRes([...res, ...response.data.data]);
    });
    };
    fetchData();
  }, [page]);
  
  const listStyle = {
    width: '100%',
    height: '100%',
    maxWidth: 1600,
    maxHeight: 850,
    bgcolor: 'rgba(135, 206, 235, 0.2)',
    alignItems: 'center',
    marginLeft: '70px',
    marginRight: '70px',
    marginTop: '50px',
    borderRadius: '20px',
    border: '5px solid rgba(135, 207, 235, 0.2);',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  };

  const emptyStyle = {
    width: '100%',
    height: '100%',
    maxWidth: 1300,
    maxHeight: 250,
    bgcolor: 'rgba(135, 206, 235, 0.2)',
    alignItems: 'center',
    marginLeft: '70px',
    marginRight: '70px',
    marginTop: '50px',
    borderRadius: '20px',
    border: '5px solid #000',
  };
  return (
    <List ref={listRef} sx={listStyle}>
      {res.length > 0 ? (
        res.map((match: any, index: any) => {
        
        const listItemStyle = {
          border: '5px solid ' + (match.winner ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 0, 0, 0.4)'), // 테두리 색상 설정
          backgroundColor: match.winner ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 0, 0, 0.4)', // 배경 색상 설정
          color: 'white', // 텍스트 색상
          padding: '10px', // 옵션: 패딩 설정
          margin : '9px', // 옵션: 마진 설정
          width: '1200px', // 옵션: 너비 설정
          marginLeft: '120px',
          borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
          // opacity: '1'
        };
        
        const textPrimaryStyle = {
          fontWeight: 'bold', // 텍스트를 굵게 설정
          fontSize: '50px', // 폰트 크기 설정
          marginLeft: '20px', // 왼쪽 마진 설정
          marginRight: '20px', // 오른쪽 마진 설정
        };
        
        const textScoreStyle = {
          fontWeight: 'bold', // 텍스트를 굵게 설정
          fontSize: '50px', // 폰트 크기 설정

        };
        const avatarStyle = {
          width: '90px', // 프로필 사진의 너비 조절
          height: '90px', // 프로필 사진의 높이 조절
        };
        const imageLoader = ({ src }: any) => {
          return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
        }
        return (
          <React.Fragment key={index}>
            <ListItem alignItems="center" sx={listItemStyle}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={imageLoader({src: userNickname})} sx={avatarStyle}/>
              </ListItemAvatar>
              <Typography variant="h6" sx={{ ...textPrimaryStyle, fontSize: '50px' }}>
                {userNickname}
              </Typography>
              <ListItemText
                primary={`${match.my_score}:${match.enemy_score}`}
                primaryTypographyProps={{ textAlign: 'center', sx: textScoreStyle }}
              />
              <Typography variant="h6" sx={{ ...textPrimaryStyle, fontSize: '50px' }}>
                {match.enemy_name}
              </Typography>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={imageLoader({src: match.enemy_name})} sx={avatarStyle}/>
              </ListItemAvatar>
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
          </React.Fragment>
        );
        })
      ) : (
        <ListItem alignItems="center" sx={emptyStyle}>
          <Typography variant="h6" sx={{ fontSize: '50px' }}>
            매치 기록이 없습니다.
          </Typography>
        </ListItem>
      )}
    </List>
  );
}